import axios from "axios";
import { env } from "../config/index.js";
import { checkQuota, updateQuota } from "./quota.guard.js";
import type {
  OddsApiEvent,
  OddsApiEventSummary,
  OddsApiScore,
  OddsApiSport,
} from "../types/odds-api.types.js";
import {
  OddsApiAuthError,
  OddsApiNotFoundError,
  OddsApiRateLimitError,
  OddsApiServerError,
} from "./odds-api.errors.js";

const client = axios.create({
  baseURL: env.ODDS_API_BASE_URL,
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  if (isPaidRequest(config.url)) {
    await checkQuota();
  }

  return config;
});

client.interceptors.response.use(
  async (response) => {
    const remaining = response.headers["x-requests-remaining"];
    const used = response.headers["x-requests-used"];

    if (remaining !== undefined && used !== undefined) {
      await updateQuota(Number(remaining), Number(used));
    }

    return response;
  },
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401 || status === 403) {
      return Promise.reject(new OddsApiAuthError(status));
    }

    if (status === 404) {
      return Promise.reject(new OddsApiNotFoundError());
    }

    if (status === 429) {
      return Promise.reject(new OddsApiRateLimitError());
    }

    if (status && status >= 500) {
      return Promise.reject(new OddsApiServerError(status));
    }

    return Promise.reject(error);
  },
);

export async function getSports(): Promise<OddsApiSport[]> {
  const response = await client.get<OddsApiSport[]>("/v4/sports", {
    params: {
      apiKey: env.ODDS_API_KEY,
    },
  });
  return response.data;
}

export async function getOdds(
  sportKey: string,
  regions: string[],
  markets: string[],
): Promise<OddsApiEvent[]> {
  const response = await client.get<OddsApiEvent[]>(
    `/v4/sports/${sportKey}/odds`,
    {
      params: {
        apiKey: env.ODDS_API_KEY,
        regions: regions.join(","),
        markets: markets.join(","),
        oddsFormat: "decimal",
        dateFormat: "iso",
      },
    },
  );
  return response.data;
}

export async function getEvents(
  sportKey: string,
): Promise<OddsApiEventSummary[]> {
  const response = await client.get<OddsApiEventSummary[]>(
    `/v4/sports/${sportKey}/events`,
    {
      params: {
        apiKey: env.ODDS_API_KEY,
        dateFormat: "iso",
      },
    },
  );
  return response.data;
}

function isPaidRequest(url?: string) {
  return Boolean(
    url?.includes("/odds") ||
      url?.includes("/scores") ||
      url?.includes("/markets"),
  );
}

export async function getScores(
  sportKey: string,
  daysFrom?: 1 | 2 | 3,
): Promise<OddsApiScore[]> {
  const response = await client.get<OddsApiScore[]>(
    `/v4/sports/${sportKey}/scores`,
    {
      params: {
        apiKey: env.ODDS_API_KEY,
        ...(daysFrom ? { daysFrom } : {}),
        dateFormat: "iso",
      },
    },
  );

  return response.data;
}


export async function getEventMarkets(
  sportKey: string,
  eventId: string,
  regions: string[],
): Promise<unknown> {
  const response = await client.get<unknown>(
    "/v4/sports/" + sportKey + "/events/" + eventId + "/markets",
    {
      params: {
        apiKey: env.ODDS_API_KEY,
        regions: regions.join(","),
        oddsFormat: "decimal",
        dateFormat: "iso",
      },
    },
  );

  return response.data;
}
