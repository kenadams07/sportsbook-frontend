import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  fetchAllSportsSuccess,
  fetchAllSportsFailure
} from "../actions/sportsActions";
import { FETCH_ALL_SPORTS_REQUEST } from "../actiontypes/sportsTypes";

function* fetchAllSportsRequestSaga() {
  try {
    console.log("fetchAllSportsRequestSaga called");
    const response = yield call(api.getAllSports);
    console.log("fetchAllSports response:", response);
    
    // Extract sports array from the response
    let sportsData = [];
    if (response && response.sports && Array.isArray(response.sports)) {
      sportsData = response.sports;
    } else if (Array.isArray(response)) {
      sportsData = response;
    }
    
    // Validate that we have valid sports objects
    const validSports = sportsData.filter(sport => 
      sport && (sport.sportId || sport.sport_id || sport.id)
    );
    
    console.log("fetchAllSports success with data:", validSports);
    yield put(fetchAllSportsSuccess(validSports));
  } catch (error) {
    console.error("Error in fetchAllSportsRequestSaga:", error);
    yield put(fetchAllSportsFailure(error.message || "Failed to fetch sports"));
  }
}

export function* watchFetchAllSportsAPI() {
  yield takeEvery(FETCH_ALL_SPORTS_REQUEST, fetchAllSportsRequestSaga);
}

export default function* sportsRootSaga() {
  yield all([watchFetchAllSportsAPI()]);
}