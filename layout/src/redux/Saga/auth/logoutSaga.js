import { all, put, takeEvery } from "redux-saga/effects";
import { removeLocalStorageItem, setLocalStorageItem } from "../../../utils/Helper";
import { logoutSuccess, logoutFailure } from "../../Action/auth/logoutAction";
import { LOGOUT } from "../../Action/actionTypes";

function* logoutRequest(action) {
  try {
    // Remove token and userData from localStorage
    removeLocalStorageItem("token");
    removeLocalStorageItem("userData");
    
    // Store logout success message in localStorage
    setLocalStorageItem("logoutMessage", "Logout successful");
    
    // Dispatch logout success action
    yield put(logoutSuccess());
    
    // Execute callback if provided
    if (action.callback && typeof action.callback === 'function') {
      action.callback();
    }
    
    // Redirect to home page immediately
    window.location.href = "/home";
  } catch (error) {
    console.error("Logout error:", error);
    yield put(logoutFailure());
  }
}

export function* watchLogoutAPI() {
  yield takeEvery(LOGOUT, logoutRequest);
}

export default function* rootSaga() {
  yield all([watchLogoutAPI()]);
}