import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../Utils/api";
import { setLocalStorageItem } from "../../../utils/Helper";
import { signupSuccess, signupFailure } from "../../Action/auth/signupAction";
import { SIGNUP } from "../../Action/actionTypes";
import { toast } from "react-hot-toast";
import { loginSuccess } from "../../Action";

export const notifyPromise = (promise, options = {}) => {
  const { ib = false } = options;
  return toast.promise(
    promise.then((res) => {
      if (res?.data?.meta?.code === 200) {
        return res;
      } else {
        throw { response: res };
      }
    }),
    {
      loading: "Signing up...",
      success: (res) => {
        if (ib) {
          return "Partner account created successfully";
        }
        return res?.data?.meta?.message || "Signed up Successfully.";
      },
      error: (err) =>
        `${err?.response?.data?.meta?.message || "Signup failed"}`,
    }
  );
};

function* signupRequest(action) {
  try {
    console.log("action?.payload",action?.payload)
    const { data } = yield notifyPromise(API.post("/users", action?.payload));

    if (data?.meta?.code === 200) {
    
        yield call(setLocalStorageItem, "userData", JSON.stringify(data.data));
        yield call(setLocalStorageItem, "token", data.meta.token);
        yield put(signupSuccess(data.data));
        yield put(loginSuccess(data.data));
    
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
