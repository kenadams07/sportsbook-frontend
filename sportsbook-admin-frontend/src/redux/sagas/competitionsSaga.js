import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  fetchCompetitionsSuccess,
  fetchCompetitionsFailure
} from "../actions/competitionsActions";
import { FETCH_COMPETITIONS_REQUEST } from "../actiontypes/competitionsTypes";

function* fetchCompetitionsRequestSaga(action) {
  try {
    console.log("fetchCompetitionsRequestSaga called with action:", action);
    const response = yield call(api.getCompetitions, action.payload);
    console.log("fetchCompetitions response:", response);
    
    // Handle the new API response format
    const sportsData = response && response.sports ? response.sports : (Array.isArray(response) ? response : []);
    
    if (sportsData && Array.isArray(sportsData) && sportsData.length > 0) {
      // Extract unique competitions and flatten events data
      const uniqueCompetitions = [];
      const competitionIds = new Set();
      const allEvents = [];
      
      sportsData.forEach(sport => {
        if (sport.competitions && Array.isArray(sport.competitions)) {
          sport.competitions.forEach(competition => {
            // Add competition to unique list if not already present
            if (competition.competitionId && !competitionIds.has(competition.competitionId)) {
              competitionIds.add(competition.competitionId);
              uniqueCompetitions.push({
                competitionId: competition.competitionId,
                competitionName: competition.competition_name || competition.competitionId
              });
            }
            
            // Add events from this competition to the flattened events array
            if (competition.events && Array.isArray(competition.events)) {
              competition.events.forEach(event => {
                // Add competition info to each event for easier filtering
                allEvents.push({
                  ...event,
                  competitionId: competition.competitionId,
                  competition_name: competition.competition_name
                });
              });
            }
          });
        }
      });
      
      console.log("fetchCompetitions success with data:", {
        competitions: uniqueCompetitions,
        eventsData: allEvents
      });
      
      yield put(fetchCompetitionsSuccess({
        competitions: uniqueCompetitions,
        eventsData: allEvents
      }));
    } else {
      console.log("fetchCompetitions success with empty data");
      yield put(fetchCompetitionsSuccess({
        competitions: [],
        eventsData: []
      }));
    }
  } catch (error) {
    console.error("Error in fetchCompetitionsRequestSaga:", error);
    yield put(fetchCompetitionsFailure(error.message || "Failed to fetch competitions"));
  }
}

export function* watchFetchCompetitionsAPI() {
  yield takeEvery(FETCH_COMPETITIONS_REQUEST, fetchCompetitionsRequestSaga);
}

export default function* competitionsRootSaga() {
  yield all([watchFetchCompetitionsAPI()]);
}