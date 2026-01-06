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
      // Add the new result to the existing results array
      // Don't check for duplicates by event ID since we want all market results for an event
      const existingResults = Array.isArray(state.results) ? state.results : [];
      
      // Get the first market ID from the new result to check for duplicates
      const newEventId = action.payload?.data?.event?.eventId || action.payload?.event?.eventId;
      
      // Extract all market IDs from the new result
      const newMarketIds = [];
      const newMarkets = action.payload?.data?.event?.markets || action.payload?.event?.markets;
      if (newMarkets) {
        Object.keys(newMarkets).forEach(marketType => {
          const marketList = newMarkets[marketType];
          if (Array.isArray(marketList)) {
            marketList.forEach(market => {
              if (market.marketId) {
                newMarketIds.push(market.marketId);
              }
            });
          }
        });
      }
      
      // Check if any of the market IDs in the new result already exist in existing results
      let existingIndex = -1;
      if (newMarketIds.length > 0) {
        existingIndex = existingResults.findIndex(result => {
          const existingEventId = result?.data?.event?.eventId || result?.event?.eventId;
          
          // Extract market IDs from existing result
          const existingMarketIds = [];
          const existingMarkets = result?.data?.event?.markets || result?.event?.markets;
          if (existingMarkets) {
            Object.keys(existingMarkets).forEach(marketType => {
              const marketList = existingMarkets[marketType];
              if (Array.isArray(marketList)) {
                marketList.forEach(market => {
                  if (market.marketId) {
                    existingMarketIds.push(market.marketId);
                  }
                });
              }
            });
          }
          
          // Check if event IDs match and any market IDs match
          return existingEventId === newEventId && 
                 existingMarketIds.some(id => newMarketIds.includes(id));
        });
      }
      
      let newResults;
      if (existingIndex !== -1) {
        // Update the existing result with the same event ID and market ID
        newResults = [...existingResults];
        newResults[existingIndex] = action.payload;
      } else {
        // Add new result for a different market of the same event
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