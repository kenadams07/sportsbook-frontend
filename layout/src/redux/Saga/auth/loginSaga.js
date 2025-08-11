import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../Utils/api";
import { notifyPromise, notifySuccess, setLocalStorageItem } from "../../../utils/Helper";
import { loginFailure, loginSuccess } from "../../Action/auth/loginAction";
import { LOGIN } from "../../Action/actionTypes";

function* loginRequest(action) {
  try {
    const { data } = yield notifyPromise(
      API.post("/login", action?.payload?.payload)
    );
    if (action?.payload?.callback) {
      yield call(action.payload.callback, data);
    }
    if (data?.meta?.code === 200) {
      yield put(loginSuccess(data?.data));
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      yield call(setLocalStorageItem, "token", data?.meta?.token);

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
