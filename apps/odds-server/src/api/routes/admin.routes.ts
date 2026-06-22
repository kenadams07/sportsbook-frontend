import type { FastifyInstance } from "fastify";

import {
  addLeague,
  addLeagues,
  addSport,
  configureSport,
  discoverEventMarkets,
  forcePoll,
  getAdminEvents,
  getAdminSportCategories,
  getAdminSports,
  getAvailableSports,
  pauseSportPolling,
  resumeSportPolling,
  restoreAdminEvents,
  syncConfiguredEvents,
  syncSportEvents,
  syncSports,
  updateEventStatus,
  updateEventStatusControl,
  updateLeagueSettings,
  updateMarketStatus,
  updateOutcomeStatus,
  updateSportCategorySettings,
} from "../controllers/admin.controller.js";

const sportKeyParamsSchema = {
  type: "object",
  required: ["sportKey"],
  properties: {
    sportKey: {
      type: "string",
      minLength: 1,
    },
  },
} as const;

const categoryKeyParamsSchema = {
  type: "object",
  required: ["categoryKey"],
  properties: {
    categoryKey: {
      type: "string",
      minLength: 1,
    },
  },
} as const;

const eventIdParamsSchema = {
  type: "object",
  required: ["eventId"],
  properties: {
    eventId: {
      type: "string",
      minLength: 1,
    },
  },
} as const;

const marketDbIdParamsSchema = {
  type: "object",
  required: ["marketDbId"],
  properties: {
    marketDbId: {
      type: "string",
      minLength: 1,
    },
  },
} as const;

const outcomeIdParamsSchema = {
  type: "object",
  required: ["outcomeId"],
  properties: {
    outcomeId: {
      type: "string",
      minLength: 1,
    },
  },
} as const;

const activeBodySchema = {
  type: "object",
  required: ["active"],
  additionalProperties: false,
  properties: {
    active: {
      type: "boolean",
    },
  },
} as const;

const leagueSettingsBodySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    active: {
      type: "boolean",
    },
    regions: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["us"],
    },
    markets: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["h2h"],
    },
    enabled: {
      type: "boolean",
      default: true,
    },
    pollIntervalMs: {
      anyOf: [
        { type: "integer", minimum: 1000 },
        { type: "null" },
      ],
    },
  },
} as const;

const updateEventStatusBodySchema = {
  type: "object",
  required: ["status"],
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      enum: ["PRE_MATCH", "LIVE", "SETTLED", "POSTPONED", "CANCELLED"],
    },
  },
} as const;

const updateEventStatusControlBodySchema = {
  type: "object",
  required: ["statusSource"],
  additionalProperties: false,
  properties: {
    statusSource: {
      type: "string",
      enum: ["SYSTEM"],
    },
  },
} as const;

const sportConfigBodySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regions: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["us"],
    },
    markets: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["h2h"],
    },
    enabled: {
      type: "boolean",
      default: true,
    },
    pollIntervalMs: {
      anyOf: [
        { type: "integer", minimum: 1000 },
        { type: "null" },
      ],
    },
  },
} as const;

const addSportBodySchema = {
  type: "object",
  required: ["key", "group", "title"],
  additionalProperties: false,
  properties: {
    key: { type: "string", minLength: 1 },
    group: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    description: { anyOf: [{ type: "string" }, { type: "null" }] },
    active: { type: "boolean", default: true },
    hasOutrights: { type: "boolean", default: false },
  },
} as const;

const addLeaguesBodySchema = {
  type: "object",
  required: ["leagues"],
  additionalProperties: false,
  properties: {
    leagues: {
      type: "array",
      minItems: 1,
      items: addSportBodySchema,
    },
    regions: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["us"],
    },
    markets: {
      type: "array",
      items: { type: "string", minLength: 1 },
      default: ["h2h"],
    },
    enabled: {
      type: "boolean",
      default: true,
    },
    pollIntervalMs: {
      anyOf: [
        { type: "integer", minimum: 1000 },
        { type: "null" },
      ],
    },
  },
} as const;

const adminEventsQuerySchema = {
  type: "object",
  properties: {
    sportKey: { type: "string", minLength: 1 },
    status: {
      type: "string",
      enum: ["PRE_MATCH", "LIVE", "SETTLED", "POSTPONED", "CANCELLED"],
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: 500,
      default: 100,
    },
    offset: {
      type: "integer",
      minimum: 0,
      default: 0,
    },
  },
} as const;

const restoreEventsBodySchema = {
  type: "object",
  required: ["eventIds", "marketKey"],
  additionalProperties: false,
  properties: {
    eventIds: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    marketKey: {
      type: "string",
      enum: ["h2h", "spreads", "totals", "outrights"],
    },
  },
} as const;

const updateMarketStatusBodySchema = {
  type: "object",
  required: ["status"],
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      enum: ["OPEN", "SUSPENDED", "CLOSED"],
    },
  },
} as const;

const updateOutcomeStatusBodySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      enum: ["ACTIVE", "INACTIVE"],
    },
    actualStatus: {
      type: "string",
      enum: ["ACTIVE", "INACTIVE"],
    },
  },
} as const;

export async function adminRoutes(server: FastifyInstance) {
  server.get("/admin/available-sports", getAvailableSports);

  server.get("/admin/sport-categories", getAdminSportCategories);

  server.get("/admin/sports", getAdminSports);

  server.post("/admin/sports", addSport);

  server.post(
    "/admin/leagues",
    { schema: { body: addLeaguesBodySchema } },
    addLeagues,
  );

  server.post(
    "/admin/leagues/one",
    { schema: { body: addSportBodySchema } },
    addLeague,
  );

  server.post("/admin/sync/sports", syncSports);

  server.patch(
    "/admin/sport-categories/:categoryKey/settings",
    {
      schema: {
        params: categoryKeyParamsSchema,
        body: activeBodySchema,
      },
    },
    updateSportCategorySettings,
  );

  server.patch(
    "/admin/leagues/:sportKey/settings",
    {
      schema: {
        params: sportKeyParamsSchema,
        body: leagueSettingsBodySchema,
      },
    },
    updateLeagueSettings,
  );

  server.post(
    "/admin/sports/:sportKey/config",
    {
      schema: {
        params: sportKeyParamsSchema,
        body: sportConfigBodySchema,
      },
    },
    configureSport,
  );

  server.get(
    "/admin/events",
    { schema: { querystring: adminEventsQuerySchema } },
    getAdminEvents,
  );

  server.post(
    "/admin/sync/events/:sportKey",
    { schema: { params: sportKeyParamsSchema } },
    syncSportEvents,
  );

  server.post("/admin/sync/events", syncConfiguredEvents);

  server.post(
    "/admin/events/restore",
    { schema: { body: restoreEventsBodySchema } },
    restoreAdminEvents,
  );

  server.get(
    "/admin/events/:eventId/markets",
    { schema: { params: eventIdParamsSchema } },
    discoverEventMarkets,
  );

  server.post(
    "/admin/pause/:sportKey",
    { schema: { params: sportKeyParamsSchema } },
    pauseSportPolling,
  );

  server.post(
    "/admin/resume/:sportKey",
    { schema: { params: sportKeyParamsSchema } },
    resumeSportPolling,
  );

  server.post(
    "/admin/force-poll/:sportKey",
    { schema: { params: sportKeyParamsSchema } },
    forcePoll,
  );

  server.patch(
    "/admin/events/:eventId/status",
    {
      schema: {
        params: eventIdParamsSchema,
        body: updateEventStatusBodySchema,
      },
    },
    updateEventStatus,
  );

  server.patch(
    "/admin/events/:eventId/status-control",
    {
      schema: {
        params: eventIdParamsSchema,
        body: updateEventStatusControlBodySchema,
      },
    },
    updateEventStatusControl,
  );

  server.patch(
    "/admin/markets/:marketDbId/status",
    {
      schema: {
        params: marketDbIdParamsSchema,
        body: updateMarketStatusBodySchema,
      },
    },
    updateMarketStatus,
  );

  server.patch(
    "/admin/outcomes/:outcomeId/status",
    {
      schema: {
        params: outcomeIdParamsSchema,
        body: updateOutcomeStatusBodySchema,
      },
    },
    updateOutcomeStatus,
  );
}
