import api from "./api";

/**
 * Fetch user bets from the API
 * @param {string} userId - The user ID
 * @param {string} [eventId] - The event ID (optional)
 * @returns {Promise<Object>} - The response data containing user bets
 */
export async function fetchUserBets(userId, eventId = null) {
  try {
    let url = `/sportBets/my-bets?userId=${userId}`;
    if (eventId) {
      url += `&eventId=${eventId}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
}