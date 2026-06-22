import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";

import { env } from "../../config/index.js";
import { keys } from "../../redis/keys.js";

type DebugOddsQuery = {
  sportKey?: string;
};

const debugOddsQuerySchema = {
  type: "object",
  properties: {
    sportKey: {
      type: "string",
      minLength: 1,
      default: "baseball_mlb",
    },
  },
} as const;

export async function debugRoutes(server: FastifyInstance) {
  server.get(
    "/debug/odds",
    { schema: { querystring: debugOddsQuerySchema } },
    renderOddsDebugPage,
  );

  server.get(
    "/debug/odds/stream",
    { schema: { querystring: debugOddsQuerySchema } },
    streamOddsDeltas,
  );
}

async function renderOddsDebugPage(
  request: FastifyRequest<{ Querystring: DebugOddsQuery }>,
  reply: FastifyReply,
) {
  const sportKey = request.query.sportKey ?? "baseball_mlb";

  return reply.type("text/html").send(buildOddsDebugHtml(sportKey));
}

async function streamOddsDeltas(
  request: FastifyRequest<{ Querystring: DebugOddsQuery }>,
  reply: FastifyReply,
) {
  const sportKey = request.query.sportKey ?? "baseball_mlb";
  const channel = keys.channel(sportKey);
  const subscriber = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  });

  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const send = (event: string, data: unknown) => {
    reply.raw.write(`event: ${event}\n`);
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send("ready", {
    sportKey,
    channel,
    connectedAt: new Date().toISOString(),
  });

  const heartbeat = setInterval(() => {
    send("heartbeat", { at: new Date().toISOString() });
  }, 15000);

  subscriber.on("message", (_channel, message) => {
    try {
      send("odds", {
        sportKey,
        channel,
        receivedAt: new Date().toISOString(),
        deltas: JSON.parse(message),
      });
    } catch {
      send("odds", {
        sportKey,
        channel,
        receivedAt: new Date().toISOString(),
        raw: message,
      });
    }
  });

  subscriber.on("error", (error) => {
    send("error", {
      message: error.message,
      at: new Date().toISOString(),
    });
  });

  await subscriber.subscribe(channel);

  request.raw.on("close", () => {
    clearInterval(heartbeat);
    void subscriber.unsubscribe(channel).finally(() => subscriber.quit());
  });
}

function buildOddsDebugHtml(sportKey: string) {
  const safeSportKey = escapeHtml(sportKey);
  const streamUrl = `/debug/odds/stream?sportKey=${encodeURIComponent(sportKey)}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Odds Debug Stream</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f4f6f8;
        color: #17202a;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
      }

      header {
        position: sticky;
        top: 0;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
        align-items: center;
        padding: 18px 24px;
        background: #ffffff;
        border-bottom: 1px solid #d9e0e7;
      }

      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }

      .meta {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        font-size: 13px;
        color: #52606d;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 4px 10px;
        border: 1px solid #c8d2dc;
        border-radius: 6px;
        background: #f8fafc;
        color: #243447;
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      }

      .controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      input {
        width: min(260px, 46vw);
        height: 34px;
        padding: 6px 10px;
        border: 1px solid #bdc8d4;
        border-radius: 6px;
        font-size: 14px;
      }

      button {
        height: 34px;
        padding: 0 12px;
        border: 1px solid #1f6feb;
        border-radius: 6px;
        background: #1f6feb;
        color: #ffffff;
        font-weight: 650;
        cursor: pointer;
      }

      main {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 18px;
        padding: 18px 24px 32px;
      }

      aside {
        align-self: start;
        padding: 14px;
        background: #ffffff;
        border: 1px solid #d9e0e7;
        border-radius: 8px;
      }

      .stat {
        display: grid;
        gap: 3px;
        padding: 10px 0;
        border-bottom: 1px solid #edf1f5;
      }

      .stat:last-child {
        border-bottom: 0;
      }

      .label {
        font-size: 12px;
        color: #66788a;
      }

      .value {
        font-size: 22px;
        font-weight: 750;
      }

      #feed {
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .empty {
        padding: 28px;
        border: 1px dashed #b8c4d0;
        border-radius: 8px;
        background: #ffffff;
        color: #5f6f7f;
      }

      .event {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid #d9e0e7;
        border-radius: 8px;
        background: #ffffff;
      }

      .event-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
        color: #405161;
        font-size: 13px;
      }

      .teams {
        color: #17202a;
        font-size: 15px;
        font-weight: 700;
      }

      .rows {
        display: grid;
        gap: 6px;
      }

      .row {
        display: grid;
        grid-template-columns: minmax(160px, 1fr) 110px 100px 70px;
        gap: 10px;
        align-items: center;
        padding: 8px 10px;
        border-radius: 6px;
        background: #f8fafc;
        border: 1px solid transparent;
        font-size: 13px;
        animation: flash-new 900ms ease-out 1;
      }

      .book {
        color: #405161;
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      }

      .price {
        font-weight: 750;
      }

      .row.moved-up {
        background: #e9f8ef;
        border-color: #8dd9ad;
        animation-name: flash-up;
      }

      .row.moved-down {
        background: #fff0ed;
        border-color: #f0a292;
        animation-name: flash-down;
      }

      .row.moved-new {
        background: #eef5ff;
        border-color: #9fc5ff;
      }

      .badge {
        justify-self: start;
        min-width: 58px;
        padding: 3px 8px;
        border-radius: 999px;
        text-align: center;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .badge.moved-up {
        background: #c9f2d8;
        color: #087443;
      }

      .badge.moved-down {
        background: #ffd9d1;
        color: #bd2c00;
      }

      .badge.moved-new {
        background: #d9eaff;
        color: #1f6feb;
      }

      @keyframes flash-up {
        0% {
          background: #69d28f;
          transform: scale(1.01);
        }
        100% {
          background: #e9f8ef;
          transform: scale(1);
        }
      }

      @keyframes flash-down {
        0% {
          background: #ff8d78;
          transform: scale(1.01);
        }
        100% {
          background: #fff0ed;
          transform: scale(1);
        }
      }

      @keyframes flash-new {
        0% {
          background: #9fc5ff;
          transform: scale(1.01);
        }
        100% {
          transform: scale(1);
        }
      }

      @media (max-width: 820px) {
        header,
        main {
          grid-template-columns: 1fr;
        }

        header {
          position: static;
        }

        .controls {
          justify-content: stretch;
        }

        input {
          width: 100%;
        }

        .row {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>Odds Debug Stream</h1>
        <div class="meta">
          <span>Channel</span>
          <span class="pill">odds:${safeSportKey}</span>
          <span id="status">Connecting...</span>
        </div>
      </div>
      <form class="controls" id="sportForm">
        <input id="sportKey" value="${safeSportKey}" aria-label="Sport key" />
        <button type="submit">Watch</button>
      </form>
    </header>

    <main>
      <aside>
        <div class="stat">
          <span class="label">Messages</span>
          <span class="value" id="messageCount">0</span>
        </div>
        <div class="stat">
          <span class="label">Deltas</span>
          <span class="value" id="deltaCount">0</span>
        </div>
        <div class="stat">
          <span class="label">Last received</span>
          <span class="value" id="lastReceived">-</span>
        </div>
      </aside>

      <section id="feed">
        <div class="empty" id="empty">Waiting for odds deltas. Trigger a force poll or wait for scheduler.</div>
      </section>
    </main>

    <script>
      const feed = document.getElementById("feed");
      const empty = document.getElementById("empty");
      const statusEl = document.getElementById("status");
      const messageCountEl = document.getElementById("messageCount");
      const deltaCountEl = document.getElementById("deltaCount");
      const lastReceivedEl = document.getElementById("lastReceived");
      const form = document.getElementById("sportForm");
      const sportInput = document.getElementById("sportKey");

      let messageCount = 0;
      let deltaCount = 0;
      const source = new EventSource("${streamUrl}");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nextSportKey = sportInput.value.trim() || "baseball_mlb";
        window.location.href = "/debug/odds?sportKey=" + encodeURIComponent(nextSportKey);
      });

      source.addEventListener("ready", (event) => {
        const data = JSON.parse(event.data);
        statusEl.textContent = "Connected to " + data.channel;
      });

      source.addEventListener("odds", (event) => {
        const data = JSON.parse(event.data);
        const deltas = Array.isArray(data.deltas) ? data.deltas : [];
        messageCount += 1;
        deltaCount += deltas.length;
        messageCountEl.textContent = String(messageCount);
        deltaCountEl.textContent = String(deltaCount);
        lastReceivedEl.textContent = new Date(data.receivedAt).toLocaleTimeString();
        renderMessage(data.receivedAt, deltas);
      });

      source.addEventListener("error", () => {
        statusEl.textContent = "Disconnected or retrying...";
      });

      function renderMessage(receivedAt, deltas) {
        if (empty) {
          empty.remove();
        }

        const byEvent = new Map();
        for (const delta of deltas) {
          const list = byEvent.get(delta.eventId) || [];
          list.push(delta);
          byEvent.set(delta.eventId, list);
        }

        for (const [eventId, rows] of byEvent) {
          const first = rows[0] || {};
          const card = document.createElement("article");
          card.className = "event";
          card.innerHTML = \`
            <div class="event-head">
              <div>
                <div class="teams">\${escapeHtml(first.awayTeam || "?")} at \${escapeHtml(first.homeTeam || "?")}</div>
                <div>\${escapeHtml(eventId)} | \${escapeHtml(first.market || "")}</div>
              </div>
              <time>\${new Date(receivedAt).toLocaleTimeString()}</time>
            </div>
            <div class="rows">
              \${rows.slice(0, 12).map(renderDeltaRow).join("")}
            </div>
          \`;

          feed.prepend(card);
        }

        while (feed.children.length > 60) {
          feed.lastElementChild.remove();
        }
      }

      function renderDeltaRow(delta) {
        const movedClass = "moved-" + escapeHtml(delta.moved || "new");
        const prevPrice = delta.prevPrice === null || delta.prevPrice === undefined ? "-" : delta.prevPrice;
        return \`
          <div class="row \${movedClass}">
            <span>\${escapeHtml(delta.outcome || "")}</span>
            <span class="book">\${escapeHtml(delta.bookmaker || "")}</span>
            <span class="price">\${escapeHtml(String(prevPrice))} -> \${escapeHtml(String(delta.price))}</span>
            <span class="badge \${movedClass}">\${escapeHtml(delta.moved || "new")}</span>
          </div>
        \`;
      }

      function escapeHtml(value) {
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }
    </script>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
