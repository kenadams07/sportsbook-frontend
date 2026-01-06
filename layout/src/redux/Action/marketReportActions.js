import {
  FETCH_MARKET_REPORT,
  FETCH_MARKET_REPORT_SUCCESS,
  FETCH_MARKET_REPORT_FAILURE
} from "./actionTypes";

// Fetch market report actions
export const fetchMarketReport = (userId, marketId = null, eventId = null) => {
  return {
    type: FETCH_MARKET_REPORT,
    payload: { userId, marketId, eventId },
  };
};

export const fetchMarketReportSuccess = (report) => {
  return {
    type: FETCH_MARKET_REPORT_SUCCESS,
    payload: report,
  };
};

export const fetchMarketReportFailure = (error) => {
  return {
    type: FETCH_MARKET_REPORT_FAILURE,
    payload: error,
  };
};