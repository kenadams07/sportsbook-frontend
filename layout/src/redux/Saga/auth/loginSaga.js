import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { loginFailure, loginSuccess } from "../../Action/auth/loginAction";
import { LOGIN } from "../../Action/actionTypes";
import { notifyPromise } from "../../../utils/notificationService";

function* loginRequest(action) {
  try {
    // Extract the actual payload from the action
    const { payload } = action;
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/login", payload), {
        loadingText: "Logging in...",
        getSuccessMessage: (res) => {
          // Handle the login response structure (success: true)
          if (res?.data?.success === true) {
            return res.data.message || "Login successful";
          }
          // Also handle the existing structure for backward compatibility
          else if (res?.data?.meta?.code === 200 || res?.data?.code === 200) {
            return res?.data?.meta?.message || res?.data?.message || "Login successful";
          }
          return null; // null prevents success notification if not successful
        },
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

    if (data?.data?.success === true || data?.data?.meta?.code === 200 || data?.data?.code === 200) {
      yield put(loginSuccess(data?.data?.data));
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data?.data));
      yield call(setLocalStorageItem, "token", data?.data?.token || data?.data?.meta?.token);
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data?.data);
      }
    } else {
      yield put(loginFailure());
    }
  } catch (error) {
    yield put(loginFailure());
  }
}

export function* watchLoginAPI() {
  yield takeEvery(LOGIN, loginRequest);
}

export default function* rootSaga() {
  yield all([watchLoginAPI()]);
}