import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  CLEAR_EVENTS_STATE
} from '../actiontypes/eventsTypes';

// Initial state for events feature
const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Reducer for events feature
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload,
      };
      
    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case CLEAR_EVENTS_STATE:
      return {
        ...initialState,
      };
      
    default:
      return state;
  }
};

export default eventsReducer;