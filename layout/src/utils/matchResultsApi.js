import api from "./api";
import { unwrapApiResponse } from "./apiResponse";

/**
 * Fetch match results from the API
 * @param {string} eventId - The event ID
 * @param {string} sportId - The sport ID
 * @param {string} marketId - The market ID
 * @returns {Promise<Object>} - The response data containing match results
 */
export async function fetchMatchResults(eventId, sportId, marketId, userId) {
  try {
    let url = `/sportBets/match-results?event_id=${eventId}&sports_id=${sportId}&market_id=${marketId}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }
    const response = await api.get(url);
    return unwrapApiResponse(response).data;
  } catch (error) {
    console.error("Error fetching match results:", error);
    throw error;
  }
}
