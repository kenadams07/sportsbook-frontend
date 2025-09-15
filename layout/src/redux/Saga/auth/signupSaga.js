import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { signupSuccess, signupFailure } from "../../Action/auth/signupAction";
import { SIGNUP } from "../../Action/actionTypes";
import { loginSuccess } from "../../Action";
import { notifyPromise } from "../../../utils/notificationService";

function* signupRequest(action) {
  try {
    console.log("action.payload in signup saga",action.payload)
  
    const data = yield call(() =>
      notifyPromise(() => API.post("/users/signup", action.payload), {
        loadingText: "On Boarding...",
        getSuccessMessage: (res) => {
          if (res?.data?.success) return res.data.message || "On Boarding...";
          return null; // null prevents success notification if success !== true
        },
        getErrorMessage: (err) => {
          // Handle timeout errors specifically
          if (err?.code === 'ECONNABORTED') {
            return 'Request timeout. Please check your connection and try again.';
          }
          return err?.response?.data?.message || err?.message || "Signup failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          // Handle success callback
        },
        onError: (err) => {
          console.log("Signup failed:", err);
        }
      })
    );

    if (data?.data?.success) {
      yield call(setLocalStorageItem, "token", data.data.token);
      yield call(setLocalStorageItem, "userData", data.data.data);
      yield put(signupSuccess(data.data.data));
      yield put(loginSuccess(data.data.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data.data);
      }
    } else {
      yield put(signupFailure());
    }

  } catch (error) {
    console.error("Signup error caught in saga:", error);
    yield put(signupFailure());
  }
}

export function* watchSignupAPI() {
  yield takeEvery(SIGNUP, signupRequest);
}

export default function* rootSaga() {
  yield all([watchSignupAPI()]);
}