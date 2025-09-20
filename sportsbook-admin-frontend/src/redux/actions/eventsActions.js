import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  CLEAR_EVENTS_STATE
} from '../actiontypes/eventsTypes';

// Action creators
export const fetchEventsRequest = () => ({
  type: FETCH_EVENTS_REQUEST
});

export const fetchEventsSuccess = (events) => ({
  type: FETCH_EVENTS_SUCCESS,
  payload: events
});

export const fetchEventsFailure = (error) => ({
  type: FETCH_EVENTS_FAILURE,
  payload: error
});

export const clearEventsState = () => ({
  type: CLEAR_EVENTS_STATE
});