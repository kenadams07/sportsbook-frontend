import {
  FETCH_MATCH_RESULTS,
  FETCH_MATCH_RESULTS_SUCCESS,
  FETCH_MATCH_RESULTS_FAILURE
} from "./actionTypes";

// Fetch match results actions
export const fetchMatchResults = (eventId, sportId, marketId) => {
  return {
    type: FETCH_MATCH_RESULTS,
    payload: { eventId, sportId, marketId },
  };
};

export const fetchMatchResultsSuccess = (results) => {
  return {
    type: FETCH_MATCH_RESULTS_SUCCESS,
    payload: results,
  };
};

export const fetchMatchResultsFailure = (error) => {
  return {
    type: FETCH_MATCH_RESULTS_FAILURE,
    payload: error,
  };
};