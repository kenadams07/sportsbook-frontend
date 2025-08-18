import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { signupSuccess, signupFailure } from "../../Action/auth/signupAction";
import { SIGNUP } from "../../Action/actionTypes";
import { loginSuccess } from "../../Action";
import { notifyPromise } from "../../../utils/notificationService";


function* signupRequest(action) {
  try {
    const data = yield call(() =>
      notifyPromise(() => API.post("/users", action.payload), {
        loadingText: "Signing up...",
        getSuccessMessage: (res) => {
          console.log("res",res)
          // Use the API response message
          if (res?.data?.code === 200) return res.data.message || "Signed up successfully";
          return null; // null prevents success notification if code !== 200
        },
        getErrorMessage: (err) => {
          // If API responds with code != 200 or throws error
          return err?.response?.data?.message || err?.message || "Signup failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          // Optional: additional logic on success
          console.log("Signup succeeded:", res.data.data);
        },
        onError: (err) => {
          console.log("Signup failed:", err);
        }
      })
    );

    if (data?.data?.code === 200) {
      // store token, dispatch success actions
      yield call(setLocalStorageItem, "token", data.data.data.token);
      yield put(signupSuccess(data.data.data));
      yield put(loginSuccess(data.data.data));
    } else {
      yield put(signupFailure());
    }

  } catch (error) {
    yield put(signupFailure());
  }
}

export function* watchSignupAPI() {
  yield takeEvery(SIGNUP, signupRequest);
}

export default function* rootSaga() {
  yield all([watchSignupAPI()]);
}
