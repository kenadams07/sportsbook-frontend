import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { notifyPromise } from "../../../utils/Helper";
import { logoutSuccess, logoutFailure } from "../../Action/auth/logoutAction";
import { LOGOUT } from "../../Action/actionTypes";

function* logoutRequest(action) {
  try {
    const { data } = yield notifyPromise(
      API.post("/logout", action?.payload?.payload)
    );
    
    if (data?.meta?.code === 200) {
      yield put(logoutSuccess());
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data);
      }
    } else {
      yield put(logoutFailure());
    }
  } catch (error) {
    yield put(logoutFailure());
  }
}

export function* watchLogoutAPI() {
  yield takeEvery(LOGOUT, logoutRequest);
}

export default function* rootSaga() {
  yield all([watchLogoutAPI()]);
}