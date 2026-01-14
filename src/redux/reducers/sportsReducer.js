import {
  FETCH_ALL_SPORTS_REQUEST,
  FETCH_ALL_SPORTS_SUCCESS,
  FETCH_ALL_SPORTS_FAILURE,
  CLEAR_SPORTS_STATE
} from '../actiontypes/sportsTypes';

// Initial state for sports feature
const initialState = {
  sports: [],
  loading: false,
  error: null,
};

// Reducer for sports feature
const sportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_SPORTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_ALL_SPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        sports: action.payload,
      };
      
    case FETCH_ALL_SPORTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case CLEAR_SPORTS_STATE:
      return {
        ...initialState,
      };
      
    default:
      return state;
  }
};

export default sportsReducer;