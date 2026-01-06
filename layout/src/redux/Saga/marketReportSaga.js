import { all, call, put, takeEvery } from "redux-saga/effects";
import { FETCH_MARKET_REPORT } from "../Action/actionTypes";
import { fetchMarketReportSuccess, fetchMarketReportFailure } from "../Action/marketReportActions";
import { fetchMarketReport as fetchMarketReportAPI } from "../../utils/marketReportApi";

// Worker saga to fetch market report
function* fetchMarketReportRequest(action) {
  try {
    const { userId, marketId, eventId } = action.payload;
    
    // Make API call to fetch market report
    const response = yield call(fetchMarketReportAPI, userId, marketId, eventId);
    
    // Check if response is successful
    if (response?.success === true) {
      // Dispatch success action with the report data
      yield put(fetchMarketReportSuccess(response));
    } else if (response?.status === "success") {
      // Handle case where response has status property
      yield put(fetchMarketReportSuccess(response));
    } else if (Array.isArray(response)) {
      // Handle case where response is directly an array of results
      yield put(fetchMarketReportSuccess(response));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || response?.data?.errorDescription || "Failed to fetch market report";
      yield put(fetchMarketReportFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch market report";
    yield put(fetchMarketReportFailure(errorMessage));
  }
}

// Watcher saga to watch for FETCH_MARKET_REPORT action
export function* watchFetchMarketReport() {
  yield takeEvery(FETCH_MARKET_REPORT, fetchMarketReportRequest);
}

// Root saga
export default function* marketReportSaga() {
  yield all([
    watchFetchMarketReport(),
  ]);
}