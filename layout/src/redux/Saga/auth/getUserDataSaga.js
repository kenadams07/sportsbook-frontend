import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/Helper";
import { getUserDataFailure, getUserDataSuccess } from "../../Action/auth/getUserDataAction";
import { GET_USER_DATA } from "../../Action/actionTypes";

function* getUserDataRequest(action) {
  try {
    console.log("getUserDataRequest called with action:", action);
    const response = yield call(API.get, "/users/profile");
    const data = response.data;
    console.log("data getuserdata", data);
    console.log("Full response:", response);

    // Handle the response structure with success field
    if (data?.success === true) {
      console.log("getUserData success with data:", data?.data);
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
      console.log("Updating localStorage with user data:", data?.data);
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        console.log("Executing callback function");
        yield call(action.callback, data);
      }
    } 
    // Handle the previous response structure with code field
    else if (data?.meta?.code === 200 || data?.code === 200) {
      console.log("getUserData success with legacy data structure:", data?.data);
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
      console.log("Updating localStorage with user data:", data?.data);
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        console.log("Executing callback function");
        yield call(action.callback, data);
      }
    } else {
      console.log("getUserData failed");
      yield put(getUserDataFailure());
    }
  } catch (error) {
    console.error("Error in getUserDataRequest:", error);
    yield put(getUserDataFailure());
  }
}

export function* watchGetUserDataAPI() {
  yield takeEvery(GET_USER_DATA, getUserDataRequest);
}

export default function* rootSaga() {
  yield all([watchGetUserDataAPI()]);
}