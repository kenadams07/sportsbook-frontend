import { all, call, put, takeEvery } from "redux-saga/effects";
import { FETCH_USER_BETS } from "../Action/actionTypes";
import { fetchUserBetsSuccess, fetchUserBetsFailure } from "../Action/userBetsActions";
import { fetchUserBets as fetchUserBetsAPI } from "../../utils/userBetsApi";

// Worker saga to fetch user bets
function* fetchUserBetsRequest(action) {
  try {
    const { userId, eventId } = action.payload;
    
    // Make API call to fetch user bets
    const response = yield call(fetchUserBetsAPI, userId, eventId);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Dispatch success action with the bets data
      yield put(fetchUserBetsSuccess(response.data));
    } else if (Array.isArray(response)) {
      // Handle case where response is directly an array of bets
      yield put(fetchUserBetsSuccess(response));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch user bets";
      yield put(fetchUserBetsFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user bets";
    yield put(fetchUserBetsFailure(errorMessage));
  }
}

// Watcher saga to watch for FETCH_USER_BETS action
export function* watchFetchUserBets() {
  yield takeEvery(FETCH_USER_BETS, fetchUserBetsRequest);
}

// Root saga
export default function* userBetsSaga() {
  yield all([
    watchFetchUserBets(),
  ]);
}