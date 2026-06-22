import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem, getIPAddresses } from "../../../utils/Helper";
import { signupSuccess, signupFailure } from "../../Action/auth/signupAction";
import { SIGNUP } from "../../Action/actionTypes";
import { loginVerificationPending } from "../../Action/auth/loginAction";
import { notifyPromise } from "../../../utils/notificationService";
import { unwrapApiResponse } from "../../../utils/apiResponse";

function* signupRequest(action) {
  try {
    // Extract the actual payload from the action
    const  originalPayload  = action.payload || action;
    // Removed console.log("action.payload in signup saga", originalPayload);
    
    // Get IP addresses
    const ipAddresses = yield call(getIPAddresses);
    
    // Add IP addresses to the payload
    const payload = {
      ...originalPayload,
      system_ip: ipAddresses.systemIP,
      browser_ip: ipAddresses.browserIP
    };
    console.log("payload",payload)
  
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/signup", payload), {
        loadingText: "Creating your account...",
        getErrorMessage: (err) => {
          // Handle different types of errors
          if (err?.code === 'ECONNABORTED') {
            return 'Request timeout. The server is taking too long to respond. Please try again or contact support.';
          }
          
          // Handle 504 Gateway Timeout specifically
          if (err?.response?.status === 504) {
            return 'Server is temporarily unavailable. Please try again in a few minutes.';
          }
          
          // Handle 502/503 errors
          if (err?.response?.status === 502 || err?.response?.status === 503) {
            return 'Service temporarily unavailable. Please try again later.';
          }
          
          // More detailed error handling
          if (err?.response?.data?.message) {
            return err.response.data.message;
          }
          if (err?.response?.data?.error) {
            return err.response.data.error;
          }
          return err?.message || "Signup failed. Please try again.";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          // Handle success callback
        },
        onError: (err) => {
          // Removed console.log("Signup failed:", err);
        }
      })
    );

    const result = unwrapApiResponse(data);
    const user = result.data.user;

    if (user) {
      yield call(setLocalStorageItem, "pendingVerificationUser", user);
      yield put(signupSuccess(user));
      yield put(loginVerificationPending(user));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, result.raw);
      }
    } else {
      yield put(signupFailure());
    }

  } catch (error) {
    // Removed console.error("Signup error caught in saga:", error);
    yield put(signupFailure());
  }
}

export function* watchSignupAPI() {
  yield takeEvery(SIGNUP, signupRequest);
}

export default function* rootSaga() {
  yield all([watchSignupAPI()]);
}
