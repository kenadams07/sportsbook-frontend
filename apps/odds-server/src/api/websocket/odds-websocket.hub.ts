import type { WebSocket } from "@fastify/websocket";
import type { RawData } from "ws";

import { logger } from "../../logger.js";
import { redisSubscriber } from "../../redis/client.js";
import { keys } from "../../redis/keys.js";
import {
  decrementSubscriberCount,
  incrementSubscriberCount,
} from "../../redis/subscriber-count.store.js";
import { serializeError } from "../../utils/serialize-error.js";

type ClientState = {
  id: string;
  socket: WebSocket;
  sportKeys: Set<string>;
};

type ClientMessage =
  | {
      type: "subscribe";
      sportKeys: string[];
    }
  | {
      type: "unsubscribe";
      sportKeys: string[];
    }
  | {
      type: "ping";
    };

const wsLogger = logger.child({ module: "odds-websocket" });
const clients = new Map<string, ClientState>();
const channelRefCounts = new Map<string, number>();
let isRedisMessageHandlerAttached = false;
let nextClientId = 1;

export function registerOddsWebSocketClient(socket: WebSocket) {
  attachRedisMessageHandler();

  const client: ClientState = {
    id: `odds-ws-${nextClientId++}`,
    socket,
    sportKeys: new Set(),
  };

  clients.set(client.id, client);

  send(client, {
    type: "connected",
    clientId: client.id,
    protocol: "odds.v1",
  });

  socket.on("message", (message: RawData) => {
    void handleClientMessage(client, message).catch((error) => {
      wsLogger.warn(
        { clientId: client.id, error: serializeError(error) },
        "failed to handle websocket message",
      );
      send(client, {
        type: "error",
        message: "Invalid websocket message",
      });
    });
  });

  socket.on("close", () => {
    void cleanupClient(client).catch((error) => {
      wsLogger.warn(
        { clientId: client.id, error: serializeError(error) },
        "failed to cleanup websocket client",
      );
    });
  });

  socket.on("error", (error: Error) => {
    wsLogger.warn(
      { clientId: client.id, error: serializeError(error) },
      "websocket client error",
    );
  });

  wsLogger.info({ clientId: client.id }, "odds websocket client connected");
}

async function handleClientMessage(client: ClientState, rawMessage: unknown) {
  const message = parseClientMessage(rawMessage);

  if (message.type === "ping") {
    send(client, {
      type: "pong",
      at: new Date().toISOString(),
    });
    return;
  }

  if (message.type === "subscribe") {
    const sportKeys = cleanSportKeys(message.sportKeys);

    for (const sportKey of sportKeys) {
      if (client.sportKeys.has(sportKey)) {
        continue;
      }

      client.sportKeys.add(sportKey);
      await incrementChannelRef(keys.channel(sportKey));
      await incrementSubscriberCount(sportKey);
    }

    send(client, {
      type: "subscribed",
      sportKeys: [...client.sportKeys],
    });
    
    return;
  }

  const sportKeys = cleanSportKeys(message.sportKeys);

  for (const sportKey of sportKeys) {
    if (!client.sportKeys.delete(sportKey)) {
      continue;
    }

    await decrementChannelRef(keys.channel(sportKey));
    await decrementSubscriberCount(sportKey);
  }

  send(client, {
    type: "subscribed",
    sportKeys: [...client.sportKeys],
  });
}

function parseClientMessage(rawMessage: unknown): ClientMessage {
  const text =
    typeof rawMessage === "string"
      ? rawMessage
      : Buffer.isBuffer(rawMessage)
        ? rawMessage.toString("utf8")
        : String(rawMessage);
  const parsed = JSON.parse(text) as Partial<ClientMessage>;

  if (parsed.type === "ping") {
    return { type: "ping" };
  }

  if (
    (parsed.type === "subscribe" || parsed.type === "unsubscribe") &&
    Array.isArray(parsed.sportKeys)
  ) {
    return {
      type: parsed.type,
      sportKeys: parsed.sportKeys,
    };
  }

  throw new Error("Unsupported websocket message");
}

function cleanSportKeys(sportKeys: string[]) {
  return [
    ...new Set(
      sportKeys
        .filter((sportKey) => typeof sportKey === "string")
        .map((sportKey) => sportKey.trim())
        .filter((sportKey) => sportKey.length > 0)
        .slice(0, 20),
    ),
  ];
}

async function incrementChannelRef(channel: string) {
  const currentCount = channelRefCounts.get(channel) ?? 0;
  channelRefCounts.set(channel, currentCount + 1);

  if (currentCount === 0) {
    await redisSubscriber.subscribe(channel);
    wsLogger.info({ channel }, "subscribed redis odds channel");
  }
}

async function decrementChannelRef(channel: string) {
  const currentCount = channelRefCounts.get(channel) ?? 0;

  if (currentCount <= 1) {
    channelRefCounts.delete(channel);
    await redisSubscriber.unsubscribe(channel);
    wsLogger.info({ channel }, "unsubscribed redis odds channel");
    return;
  }

  channelRefCounts.set(channel, currentCount - 1);
}

function attachRedisMessageHandler() {
  if (isRedisMessageHandlerAttached) {
    return;
  }

  redisSubscriber.on("message", (channel, message) => {
    const sportKey = channel.replace(/^odds:/, "");
    const payload = buildOddsUpdatePayload(sportKey, channel, message);

    for (const client of clients.values()) {
      if (!client.sportKeys.has(sportKey)) {
        continue;
      }

      send(client, payload);
    }
  });

  isRedisMessageHandlerAttached = true;
}

function buildOddsUpdatePayload(
  sportKey: string,
  channel: string,
  message: string,
) {
  try {
    return {
      type: "odds:update",
      sportKey,
      channel,
      receivedAt: new Date().toISOString(),
      deltas: JSON.parse(message),
    };
  } catch {
    return {
      type: "odds:update",
      sportKey,
      channel,
      receivedAt: new Date().toISOString(),
      raw: message,
    };
  }
}

async function cleanupClient(client: ClientState) {
  clients.delete(client.id);

  for (const sportKey of client.sportKeys) {
    await decrementChannelRef(keys.channel(sportKey));
    await decrementSubscriberCount(sportKey);
  }

  client.sportKeys.clear();
  wsLogger.info({ clientId: client.id }, "odds websocket client disconnected");
}

function send(client: ClientState, payload: unknown) {
  if (client.socket.readyState !== client.socket.OPEN) {
    return;
  }

  client.socket.send(JSON.stringify(payload));
}
