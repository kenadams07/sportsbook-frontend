const MARKETS_API_BASE_URL = import.meta.env.VITE_MARKETS_API_URL || "http://localhost:3003";
const ODDS_API_BASE_URL = import.meta.env.VITE_ODDS_API_BASE_URL || "http://127.0.0.1:3010";

const SPORT_CATEGORY_KEY_BY_SPORT_ID = {
  "sr:sport:1": "soccer",
  "sr:sport:2": "basketball",
  "sr:sport:3": "baseball",
  "sr:sport:4": "ice_hockey",
  "sr:sport:5": "tennis",
  "sr:sport:16": "american_football",
  "sr:sport:21": "cricket",
};

const leagueKeysCache = new Map();

/**
 * Utility function to implement retry logic with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise<any>} - Result of the function call
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    if (retries === 0) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

async function fetchJson(url) {
  const response = await retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, 2, 1000);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchConfiguredLeagueKeysForSportCategory(categoryKey) {
  if (!categoryKey) {
    return [];
  }

  if (leagueKeysCache.has(categoryKey)) {
    return leagueKeysCache.get(categoryKey);
  }

  const data = await fetchJson(
    `${ODDS_API_BASE_URL}/frontend/sports/${encodeURIComponent(categoryKey)}/leagues`,
  );

  const leagueKeys = Array.isArray(data.leagues)
    ? data.leagues.map((league) => league.key).filter(Boolean)
    : [];

  leagueKeysCache.set(categoryKey, leagueKeys);
  return leagueKeys;
}

/**
 * Fetch sports events from the API
 * @param {string} sportId - The sport ID (e.g., "sr:sport:1")
 * @param {boolean} liveMatches - Whether to fetch live matches or scheduled matches
 * @returns {Promise<Object>} - The response data containing sports events
 */
export async function fetchSportsEvents(sportId, liveMatches = true) {
  try {
    const categoryKey = SPORT_CATEGORY_KEY_BY_SPORT_ID[sportId];

    if (categoryKey) {
      return fetchOddsServerCategoryEvents(categoryKey, liveMatches);
    }

    return {
      sports: [],
      eventsCount: 0
    };
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching sports events:', error.message);
    }

    return {
      sports: [],
      eventsCount: 0
    };
  }
}

async function fetchOddsServerCategoryEvents(categoryKey, liveMatches) {
  const leagueKeys = await fetchConfiguredLeagueKeysForSportCategory(categoryKey);

  if (leagueKeys.length === 0) {
    return {
      sports: [],
      eventsCount: 0,
    };
  }

  const results = await Promise.all(
    leagueKeys.map((leagueKey) =>
      fetchOddsServerSportsEvents(leagueKey, liveMatches).catch((error) => {
        console.error(`Error fetching events for league ${leagueKey}:`, error.message);
        return { sports: [], eventsCount: 0 };
      }),
    ),
  );

  const sports = results.flatMap((result) => result.sports || []);

  return {
    sports,
    eventsCount: sports.length,
  };
}

async function fetchOddsServerSportsEvents(oddsSportKey, liveMatches) {
  const status = liveMatches ? "live" : "pre_match";
  const url = `${ODDS_API_BASE_URL}/frontend/events/${oddsSportKey}?status=${status}&limit=100`;
  const data = await fetchJson(url);

  return {
    sports: Array.isArray(data.events) ? data.events : [],
    eventsCount: Array.isArray(data.events) ? data.events.length : 0,
  };
}

/**
 * Fetch markets data for a specific event
 * @param {string} eventId - The event ID
 * @param {string} sportId - The sport ID (e.g., "sr:sport:1")
 * @returns {Promise<Object>} - The response data containing markets
 */
export async function fetchMarketsData(eventId, sportId) {
  try {
    const url = `${MARKETS_API_BASE_URL}/api/markets?event_id=${eventId}&sport_id=${sportId}`;

    const response = await retryWithBackoff(async (signal) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
    }, 2, 1000);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "RS_OK") {
      throw new Error(`API error: ${data.errorDescription || 'Unknown error'}`);
    }

    const markets = data?.event?.markets;

    if (!markets) return [];

    if (Array.isArray(markets)) return markets;

    return Object.values(markets).flatMap(v => Array.isArray(v) ? v : []);
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
        return { sports: [] };
      })
    );

    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    console.error("Error fetching multiple sports events:", error);
    throw error;
  }
}
