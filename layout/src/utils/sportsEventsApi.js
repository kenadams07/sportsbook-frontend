// Use the proxy endpoint to avoid CORS issues
const EVENTS_API_PROXY = "/api/events";

/**
 * Fetch sports events from the API through proxy to avoid CORS issues
 * @param {string} sportId - The sport ID (e.g., "sr:sport:1")
 * @param {boolean} liveMatches - Whether to fetch live matches or scheduled matches
 * @returns {Promise<Object>} - The response data containing sports events
 */
export async function fetchSportsEvents(sportId, liveMatches = true) {
  try {
    // Use the proxy endpoint to avoid CORS issues
    const url = `${EVENTS_API_PROXY}?sport_id=${sportId}&live_matches=${liveMatches}`;
    console.log(`Fetching sports events through proxy: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched events through proxy for sport_id=${sportId}, live_matches=${liveMatches}`);
    
    // API returns data directly in { sports: [...], status: ..., errorDescription: ... } format
    return {
      sports: data?.sports || [],
      eventsCount: data?.sports?.length || 0
    };
  } catch (error) {
    console.error(`API request failed for sport_id=${sportId}:`, error.message);
    // Even if the endpoint fails, we should return a valid structure to prevent app crashes
    return {
      sports: [],
      eventsCount: 0
    };
  }
}

/**
 * Fetch all sports events for multiple sports with fallback mechanism
 * @param {Array<string>} sportIds - Array of sport IDs
 * @param {boolean} liveMatches - Whether to fetch live matches or scheduled matches
 * @returns {Promise<Array>} - Array of promises for each sport's events
 */
export async function fetchMultipleSportsEvents(sportIds, liveMatches = true) {
  try {
    const fetchPromises = sportIds.map(sportId => 
      fetchSportsEvents(sportId, liveMatches).catch(error => {
        console.error(`Error fetching events for sport ${sportId}:`, error);
        return { sports: [] }; // Return empty array on error for this sport
      })
    );
    
    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    console.error("Error fetching multiple sports events:", error);
    throw error;
  }
}