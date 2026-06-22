import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/Helper";
import { getUserDataFailure, getUserDataSuccess } from "../../Action/auth/getUserDataAction";
import { GET_USER_DATA } from "../../Action/actionTypes";
import { unwrapApiResponse } from "../../../utils/apiResponse";

function* getUserDataRequest(action) {
  try {
   
    const response = yield call(API.get, "/users/profile");
    const result = unwrapApiResponse(response);

    yield put(getUserDataSuccess(result.data));
    yield call(setLocalStorageItem, "userData", JSON.stringify(result.data));

    if (action.callback && typeof action.callback === 'function') {
      yield call(action.callback, result.raw);
    }
  } catch (error) {
    // Removed console.error("Error in getUserDataRequest:", error);
    yield put(getUserDataFailure());
  }
}

export function* watchGetUserDataAPI() {
  yield takeEvery(GET_USER_DATA, getUserDataRequest);
}

export default function* rootSaga() {
  yield all([watchGetUserDataAPI()]);
}
