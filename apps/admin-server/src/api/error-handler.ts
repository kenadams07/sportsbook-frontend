import type { FastifyError, FastifyInstance } from "fastify";

import { sendError } from "./response.js";
import { AppError } from "./app-error.js";

export function registerErrorHandler(server: FastifyInstance) {
  server.setErrorHandler(
    (error: FastifyError, request, reply) => {
      request.log.error({ error }, "admin request failed");


      if (error instanceof AppError) {
  return sendError(reply, error.message, error.statusCode, {
    code: error.code,
  });
}

      if (error.validation) {
        return sendError(
          reply,
          error.message,
          400,
          { code: "VALIDATION_ERROR" },
        );
      }

      const statusCode =
        error.statusCode && error.statusCode >= 400
          ? error.statusCode
          : 500;

      const message =
        statusCode >= 500
          ? "Internal server error"
          : error.message;

      return sendError(reply, message, statusCode);
    },
  );



  server.setNotFoundHandler((request, reply) => {
    return sendError(
      reply,
      `Route ${request.method}:${request.url} not found`,
      404,
      { code: "NOT_FOUND" },
    );
  });
}