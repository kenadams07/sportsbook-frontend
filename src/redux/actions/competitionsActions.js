import {
  FETCH_COMPETITIONS_REQUEST,
  FETCH_COMPETITIONS_SUCCESS,
  FETCH_COMPETITIONS_FAILURE,
  CLEAR_COMPETITIONS_STATE
} from '../actiontypes/competitionsTypes';

// Action creators
export const fetchCompetitionsRequest = (sportId) => ({
  type: FETCH_COMPETITIONS_REQUEST,
  payload: sportId
});

export const fetchCompetitionsSuccess = (data) => ({
  type: FETCH_COMPETITIONS_SUCCESS,
  payload: data
});

export const fetchCompetitionsFailure = (error) => ({
  type: FETCH_COMPETITIONS_FAILURE,
  payload: error
});

export const clearCompetitionsState = () => ({
  type: CLEAR_COMPETITIONS_STATE
});