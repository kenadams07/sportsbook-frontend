import pino from "pino";

import { env } from "./config/index.js";

const loggerOptions = {
  level: env.NODE_ENV === "development" ? "debug" : "info",
};

export const logger =
  env.NODE_ENV === "development"
    ? pino({
        ...loggerOptions,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
          },
        },
      })
    : pino(loggerOptions);
