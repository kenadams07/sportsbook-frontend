import {
  FETCH_MARKET_REPORT,
  FETCH_MARKET_REPORT_SUCCESS,
  FETCH_MARKET_REPORT_FAILURE
} from "../Action/actionTypes";

const INIT_STATE = {
  report: [],
  loading: false,
  error: null,
};

const marketReportReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_MARKET_REPORT:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_MARKET_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        report: Array.isArray(action.payload) ? action.payload : action.payload?.data || [],
        error: null,
      };
      
    case FETCH_MARKET_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        report: [],
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default marketReportReducer;