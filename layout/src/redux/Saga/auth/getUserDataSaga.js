import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/Helper";
import { getUserDataFailure, getUserDataSuccess } from "../../Action/auth/getUserDataAction";
import { GET_USER_DATA } from "../../Action/actionTypes";

function* getUserDataRequest(action) {
  try {
   
    const response = yield call(API.get, "/users/profile");
    const data = response.data;
 

    // Handle the response structure with success field
    if (data?.success === true) {
  
      yield put(getUserDataSuccess(data?.data));
      
  
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
    
        yield call(action.callback, data);
      }
    } 
    // Handle the previous response structure with code field
    else if (data?.meta?.code === 200 || data?.code === 200) {
    
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
     
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
      
        yield call(action.callback, data);
      }
    } else {
      // Removed console.log("getUserData failed");
      yield put(getUserDataFailure());
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