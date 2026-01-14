import {
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  CREATE_EVENT_FAILURE,
  CLEAR_CREATE_EVENT_STATE,
  RESET_CREATE_EVENT_SUCCESS
} from '../actiontypes/createEventTypes';

// Action creators
export const createEventRequest = (eventData) => ({
  type: CREATE_EVENT_REQUEST,
  payload: eventData
});

export const createEventSuccess = (event) => ({
  type: CREATE_EVENT_SUCCESS,
  payload: event
});

export const createEventFailure = (error) => ({
  type: CREATE_EVENT_FAILURE,
  payload: error
});

export const clearCreateEventState = () => ({
  type: CLEAR_CREATE_EVENT_STATE
});

export const resetCreateEventSuccess = () => ({
  type: RESET_CREATE_EVENT_SUCCESS
});