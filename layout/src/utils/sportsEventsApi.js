import { EVENTS_API_URL } from "./Constants";

// Backup endpoint for fallback
const BACKUP_EVENTS_API_URL = "http://89.116.20.218:2700";

/**
 * Fetch sports events from the real API with fallback to backup endpoint
 * @param {string} sportId - The sport ID (e.g., "sr:sport:1")
 * @param {boolean} liveMatches - Whether to fetch live matches or scheduled matches
 * @returns {Promise<Object>} - The response data containing sports events
 */
export async function fetchSportsEvents(sportId, liveMatches = true) {
  // Try primary endpoint first
  try {
    const url = `${EVENTS_API_URL}/events?sport_id=${sportId}&live_matches=${liveMatches}`;
    console.log(`Fetching sports events from primary endpoint: ${url}`);
    
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
    console.log(`Successfully fetched events from primary endpoint for sport_id=${sportId}, live_matches=${liveMatches}`);
    
    // Extract sports data from the primary API response structure
    // Primary API returns data in { data: { sports: [...], eventsCount: ... } } format
    return {
      sports: data?.data?.sports || [],
      eventsCount: data?.data?.eventsCount || 0
    };
  } catch (primaryError) {
    console.error(`Primary endpoint failed for sport_id=${sportId}, trying backup endpoint:`, primaryError.message);
    
    // Fallback to backup endpoint
    try {
      const backupUrl = `${BACKUP_EVENTS_API_URL}/events?sport_id=${sportId}&live_matches=${liveMatches}`;
      console.log(`Fetching sports events from backup endpoint: ${backupUrl}`);
      
      const response = await fetch(backupUrl, {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Successfully fetched events from backup endpoint for sport_id=${sportId}, live_matches=${liveMatches}`);
      
      // Backup endpoint returns data directly in { sports: [...], status: ..., errorDescription: ... } format
      return {
        sports: data?.sports || [],
        eventsCount: data?.sports?.length || 0
      };
    } catch (backupError) {
      console.error(`Backup endpoint also failed for sport_id=${sportId}:`, backupError.message);
      throw new Error(`Both primary and backup endpoints failed for sport_id=${sportId}: ${primaryError.message}, ${backupError.message}`);
    }
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