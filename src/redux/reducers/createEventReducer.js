import {
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  CREATE_EVENT_FAILURE,
  CLEAR_CREATE_EVENT_STATE,
  RESET_CREATE_EVENT_SUCCESS
} from '../actiontypes/createEventTypes';

// Initial state for create event feature
const initialState = {
  events: [],
  loading: false,
  error: null,
  success: false,
};

// Reducer for create event feature
const createEventReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
      
    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        // Add the new event to the events array
        events: [...state.events, action.payload],
      };
      
    case CREATE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
      
    case CLEAR_CREATE_EVENT_STATE:
      return {
        ...initialState,
      };
      
    case RESET_CREATE_EVENT_SUCCESS:
      return {
        ...state,
        success: false,
      };
      
    default:
      return state;
  }
};

export default createEventReducer;