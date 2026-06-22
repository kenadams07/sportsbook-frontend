import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem, getIPAddresses } from "../../../utils/Helper";
import { loginFailure, loginSuccess } from "../../Action/auth/loginAction";
import { LOGIN } from "../../Action/actionTypes";
import { notifyPromise } from "../../../utils/notificationService";
import { unwrapApiResponse } from "../../../utils/apiResponse";

function* loginRequest(action) {
  try {
    // Extract the actual payload from the action
    const { payload } = action;
    
    // Get IP addresses
    const ipAddresses = yield call(getIPAddresses);
    
    // Add IP addresses to the payload
    const payloadWithIPs = {
      ...payload,
      system_ip: ipAddresses.systemIP,
      browser_ip: ipAddresses.browserIP
    };
    
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/login", payloadWithIPs), {
        loadingText: "Logging in...",
        getErrorMessage: (err) => {
          // Handle timeout errors specifically
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
          
          return err?.response?.data?.message || err?.message || "Login failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          // Removed console.log("Login succeeded:", res.data);
        },
        onError: (err) => {
          // Removed console.log("Login failed:", err);
        }
      })
    );

    const result = unwrapApiResponse(data);
    yield put(loginSuccess(result.data.user));
    yield call(setLocalStorageItem, "userData", JSON.stringify(result.data.user));
    yield call(setLocalStorageItem, "token", result.data.token);
      
    if (action.callback && typeof action.callback === 'function') {
      yield call(action.callback, result.raw);
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

export function* watchLoginAPI() {
  yield takeEvery(LOGIN, loginRequest);
}

export default function* rootSaga() {
  yield all([watchLoginAPI()]);
}
