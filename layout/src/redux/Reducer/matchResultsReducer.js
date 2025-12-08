import {
  FETCH_MATCH_RESULTS,
  FETCH_MATCH_RESULTS_SUCCESS,
  FETCH_MATCH_RESULTS_FAILURE
} from "../Action/actionTypes";

const INIT_STATE = {
  results: [],
  loading: false,
  error: null,
};

const matchResultsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_MATCH_RESULTS:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_MATCH_RESULTS_SUCCESS:
      // Add the new result to the existing results array, avoiding duplicates
      const existingResults = Array.isArray(state.results) ? state.results : [];
      
      // Check if this result already exists based on event ID
      const eventExists = existingResults.some(result => {
        const existingEventId = result?.data?.event?.eventId || result?.event?.eventId;
        const newEventId = action.payload?.data?.event?.eventId || action.payload?.event?.eventId;
        return existingEventId === newEventId;
      });
      
      let newResults;
      if (eventExists) {
        // Update existing result
        newResults = existingResults.map(result => {
          const existingEventId = result?.data?.event?.eventId || result?.event?.eventId;
          const newEventId = action.payload?.data?.event?.eventId || action.payload?.event?.eventId;
          if (existingEventId === newEventId) {
            return action.payload;
          }
          return result;
        });
      } else {
        // Add new result
        newResults = [...existingResults, action.payload];
      }
      
      return {
        ...state,
        loading: false,
        results: newResults,
        error: null,
      };
      
    case FETCH_MATCH_RESULTS_FAILURE:
      return {
        ...state,
        loading: false,
        results: [],
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default matchResultsReducer;