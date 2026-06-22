import api from "./api";
import { unwrapApiResponse } from "./apiResponse";

/**
 * Fetch market report from the API
 * @param {string} userId - The user ID
 * @param {string} marketId - Optional market ID filter
 * @param {string} eventId - Optional event ID filter
 * @returns {Promise<Object>} - The response data containing market report
 */
export async function fetchMarketReport(userId, marketId = null, eventId = null) {
  try {
    let url = `/sportBets/market-report?user_id=${userId}`;
    if (marketId) {
      url += `&market_id=${marketId}`;
    }
    if (eventId) {
      url += `&event_id=${eventId}`;
    }
    const response = await api.get(url);
    return unwrapApiResponse(response).data;
  } catch (error) {
    console.error("Error fetching market report:", error);
    throw error;
  }
}
