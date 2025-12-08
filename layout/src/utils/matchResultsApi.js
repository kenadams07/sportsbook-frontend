import api from "./api";

/**
 * Fetch match results from the API
 * @param {string} eventId - The event ID
 * @param {string} sportId - The sport ID
 * @param {string} marketId - The market ID
 * @returns {Promise<Object>} - The response data containing match results
 */
export async function fetchMatchResults(eventId, sportId, marketId) {
  try {
    const response = await api.get(`/sportBets/match-results?event_id=${eventId}&sports_id=${sportId}&market_id=${marketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching match results:", error);
    throw error;
  }
}