import {
  FETCH_ALL_SPORTS_REQUEST,
  FETCH_ALL_SPORTS_SUCCESS,
  FETCH_ALL_SPORTS_FAILURE,
  CLEAR_SPORTS_STATE
} from '../actiontypes/sportsTypes';

// Action creators
export const fetchAllSportsRequest = () => ({
  type: FETCH_ALL_SPORTS_REQUEST
});

export const fetchAllSportsSuccess = (sports) => ({
  type: FETCH_ALL_SPORTS_SUCCESS,
  payload: sports
});

export const fetchAllSportsFailure = (error) => ({
  type: FETCH_ALL_SPORTS_FAILURE,
  payload: error
});

export const clearSportsState = () => ({
  type: CLEAR_SPORTS_STATE
});