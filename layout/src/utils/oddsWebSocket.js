const ODDS_WS_URL =
  import.meta.env.VITE_ODDS_WS_URL || "ws://127.0.0.1:3001/ws/odds";

export function createOddsSocket({ sportKeys = [], onOddsUpdate, onStatus }) {
  let socket;
  let manuallyClosed = false;
  let reconnectAttempts = 0;
  let reconnectTimer = null;
  let currentSportKeys = [...sportKeys];

  function connect() {
    socket = new WebSocket(ODDS_WS_URL);

    socket.onopen = () => {
      reconnectAttempts = 0;
      onStatus?.("connected");
      subscribe(currentSportKeys);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "connected") {
        onStatus?.("ready");
        return;
      }

      if (message.type === "subscribed") {
        onStatus?.("subscribed", message);
        return;
      }

      if (message.type === "odds:update") {
        onOddsUpdate?.(message);
        return;
      }

      if (message.type === "error") {
        onStatus?.("error", message);
      }
    };

    socket.onerror = (error) => {
      onStatus?.("error", error);
    };

    socket.onclose = () => {
      onStatus?.("closed");

      if (!manuallyClosed) {
        scheduleReconnect();
      }
    };
  }

  function send(payload) {
    if (socket?.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(payload));
    return true;
  }

  function subscribe(nextSportKeys) {
    currentSportKeys = [...nextSportKeys];

    if (currentSportKeys.length === 0) {
      return;
    }

    send({
      type: "subscribe",
      sportKeys: currentSportKeys,
    });
  }

  function scheduleReconnect() {
    if (reconnectTimer) {
      return;
    }

    const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000);
    reconnectAttempts += 1;
    onStatus?.("reconnecting", { delay });

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;

      if (!manuallyClosed) {
        connect();
      }
    }, delay);
  }

  connect();

  return {
    get socket() {
      return socket;
    },

    subscribe(nextSportKeys) {
      subscribe(nextSportKeys);
    },

    unsubscribe(nextSportKeys) {
      send({
        type: "unsubscribe",
        sportKeys: nextSportKeys,
      });
    },

    close() {
      manuallyClosed = true;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      socket?.close();
    },
  };
}
