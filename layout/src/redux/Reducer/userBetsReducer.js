import {
  FETCH_USER_BETS,
  FETCH_USER_BETS_SUCCESS,
  FETCH_USER_BETS_FAILURE,
  SKIP_NEXT_USER_BETS_FETCH
} from "../Action/actionTypes";

const INIT_STATE = {
  bets: [],
  loading: false,
  error: null,
  skipNextFetch: false,
};

const userBetsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_BETS:
      // If we're supposed to skip this fetch, just reset the flag and don't do anything
      if (state.skipNextFetch) {
        return {
          ...state,
          skipNextFetch: false,
        };
      }
      
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_USER_BETS_SUCCESS:
      return {
        ...state,
        loading: false,
        bets: action.payload,
        error: null,
      };
      
    case FETCH_USER_BETS_FAILURE:
      return {
        ...state,
        loading: false,
        bets: [],
        error: action.payload,
      };
      
    case SKIP_NEXT_USER_BETS_FETCH:
      return {
        ...state,
        skipNextFetch: true,
      };
      
    default:
      return state;
  }
};

export default userBetsReducer;