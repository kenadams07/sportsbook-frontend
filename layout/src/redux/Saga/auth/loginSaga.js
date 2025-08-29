import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { loginFailure, loginSuccess } from "../../Action/auth/loginAction";
import { LOGIN } from "../../Action/actionTypes";
import { notifyPromise } from "../../../utils/notificationService";

function* loginRequest(action) {
  try {
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/login", action?.payload?.payload), {
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
          return err?.response?.data?.message || err?.message || "Login failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          console.log("Login succeeded:", res.data);
        },
        onError: (err) => {
          console.log("Login failed:", err);
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