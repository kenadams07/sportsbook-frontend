// Use the proxy endpoint to avoid CORS issues
const EVENTS_API_PROXY = "/api/events";

/**
 * Utility function to implement retry logic with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise<any>} - Result of the function call
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    // Pass AbortSignal to the function if it accepts it
    return await fn();
  } catch (error) {
    // Don't retry if the request was aborted
    if (error.name === 'AbortError') {
      throw error;
    }
    
    if (retries === 0) {
      throw error;
    }
    // Wait for the specified delay before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    // Retry with exponential backoff (double the delay each time)
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

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
    
    // Wrap the fetch call with retry logic and timeout
    const response = await retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "accept": "application/json",
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return res;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }, 2, 1000); // Retry up to 2 times with 1 second initial delay

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
   
    // API returns data directly in { sports: [...], status: ..., errorDescription: ... } format
    return {
      sports: data?.sports || [],
      eventsCount: data?.sports?.length || 0
    };
  } catch (error) {
    // Don't log aborted requests as errors
    if (error.name !== 'AbortError') {
 
    }
    // Even if the endpoint fails, we should return a valid structure to prevent app crashes
    return {
      sports: [],
      eventsCount: 0
    };
  }
}

/**
 * Fetch markets data for a specific event
 * @param {string} eventId - The event ID
 * @param {string} sportId - The sport ID (e.g., "sr:sport:1")
 * @returns {Promise<Object>} - The response data containing markets
 */
export async function fetchMarketsData(eventId, sportId) {
  try {
    // Use the markets proxy endpoint to avoid CORS issues
    const url = `/api/markets?event_id=${eventId}&sport_id=${sportId}`;
    
    // Wrap the fetch call with retry logic and timeout
    const response = await retryWithBackoff(async (signal) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // If a signal is provided (from outside), combine it with our controller
      if (signal) {
        signal.addEventListener('abort', () => {
          controller.abort();
        });
      }
      
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "accept": "application/json",
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return res;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }, 2, 1000); // Retry up to 2 times with 1 second initial delay

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return markets data from the nested structure
    return data?.event?.markets?.matchOdds || [];
  } catch (error) {
    console.error(`API request failed for event_id=${eventId}, sport_id=${sportId}:`, error.message);
    return [];
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