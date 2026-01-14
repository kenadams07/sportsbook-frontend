import {
  FETCH_COMPETITIONS_REQUEST,
  FETCH_COMPETITIONS_SUCCESS,
  FETCH_COMPETITIONS_FAILURE,
  CLEAR_COMPETITIONS_STATE
} from '../actiontypes/competitionsTypes';

// Initial state for competitions feature
const initialState = {
  competitions: [],
  eventsData: [],
  loading: false,
  error: null,
};

// Reducer for competitions feature
const competitionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMPETITIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_COMPETITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        competitions: action.payload.competitions,
        eventsData: action.payload.eventsData,
      };
      
    case FETCH_COMPETITIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case CLEAR_COMPETITIONS_STATE:
      return {
        ...initialState,
      };
      
    default:
      return state;
  }
};

export default competitionsReducer;