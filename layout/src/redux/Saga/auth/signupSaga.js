import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { signupSuccess, signupFailure } from "../../Action/auth/signupAction";
import { LOGIN_SUCCESS } from "../../Action/actionTypes"; // Import LOGIN_SUCCESS
import { SIGNUP } from "../../Action/actionTypes";
import { notifyPromise } from "../../../utils/notificationService";

function* signupRequest(action) {
  try {
    // Extract the actual payload from the action
    const  payload  = action.payload || action;
    // Removed console.log("action.payload in signup saga", payload);
    
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/signup", payload), {
        loadingText: "Creating your account...",
        getSuccessMessage: (res) => {
          if (res?.data?.success) return res.data.message || "Account created successfully!";
          return null; // null prevents success notification if success !== true
        },
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

    if (data?.data?.success) {
      yield call(setLocalStorageItem, "token", data.data.token);
      yield call(setLocalStorageItem, "userData", data.data.data);
      yield put(signupSuccess(data.data.data));
      // Dispatch login success as well to update the state
      yield put({ type: LOGIN_SUCCESS, payload: data.data.data });
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data.data);
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