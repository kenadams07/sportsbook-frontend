import type { WebSocket } from "ws";

type AccountUpdatePayload = {
  userId: string;
  balance: number;
  exposure: number;
  availableBalance: number;
};

type UserSocketMessage =
  | {
      type: "connected";
      userId: string;
    }
  | {
      type: "user:balance_exposure:update";
      data: AccountUpdatePayload;
    }
  | {
      type: "error";
      message: string;
    };

const socketsByUserId = new Map<string, Set<WebSocket>>();

function send(socket: WebSocket, message: UserSocketMessage) {
  if (socket.readyState !== socket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(message));
}

export function registerUserWebSocketClient(userId: string, socket: WebSocket) {
  const userSockets = socketsByUserId.get(userId) ?? new Set<WebSocket>();
  userSockets.add(socket);
  socketsByUserId.set(userId, userSockets);

  send(socket, {
    type: "connected",
    userId,
  });

  socket.on("close", () => {
    userSockets.delete(socket);

    if (userSockets.size === 0) {
      socketsByUserId.delete(userId);
    }
  });

  socket.on("error", () => {
    userSockets.delete(socket);

    if (userSockets.size === 0) {
      socketsByUserId.delete(userId);
    }
  });
}

export function emitUserAccountUpdate(payload: AccountUpdatePayload) {
  const sockets = socketsByUserId.get(payload.userId);

  if (!sockets || sockets.size === 0) {
    return 0;
  }

  let sent = 0;

  for (const socket of sockets) {
    send(socket, {
      type: "user:balance_exposure:update",
      data: payload,
    });
    sent += 1;
  }

  return sent;
}
