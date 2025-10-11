import api from "./api";

/**
 * Fetch user bets from the API
 * @param {string} userId - The user ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - The response data containing user bets
 */
export async function fetchUserBets(userId, eventId) {
  try {
    const response = await api.get(`/sportBets/my-bets?userId=${userId}&eventId=${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
}