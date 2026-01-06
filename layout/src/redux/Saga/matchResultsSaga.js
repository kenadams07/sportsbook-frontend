import { all, call, put, takeEvery } from "redux-saga/effects";
import { FETCH_MATCH_RESULTS } from "../Action/actionTypes";
import { fetchMatchResultsSuccess, fetchMatchResultsFailure } from "../Action/matchResultsActions";
import { fetchMatchResults as fetchMatchResultsAPI } from "../../utils/matchResultsApi";

// Worker saga to fetch match results
function* fetchMatchResultsRequest(action) {
  try {
    const { eventId, sportId, marketId, userId } = action.payload;
    
    // Make API call to fetch match results
    const response = yield call(fetchMatchResultsAPI, eventId, sportId, marketId, userId);
    
    // Check if response is successful
    if (response?.success === true) {
      // Dispatch success action with the results data
      yield put(fetchMatchResultsSuccess(response));
    } else if (response?.status === "success") {
      // Handle case where response has status property
      yield put(fetchMatchResultsSuccess(response));
    } else if (Array.isArray(response)) {
      // Handle case where response is directly an array of results
      yield put(fetchMatchResultsSuccess(response));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || response?.data?.errorDescription || "Failed to fetch match results";
      yield put(fetchMatchResultsFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch match results";
    yield put(fetchMatchResultsFailure(errorMessage));
  }
}

// Watcher saga to watch for FETCH_MATCH_RESULTS action
export function* watchFetchMatchResults() {
  yield takeEvery(FETCH_MATCH_RESULTS, fetchMatchResultsRequest);
}

// Root saga
export default function* matchResultsSaga() {
  yield all([
    watchFetchMatchResults(),
  ]);
}