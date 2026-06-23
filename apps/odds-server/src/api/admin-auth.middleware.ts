import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../config/index.js";

type AdminTokenPayload = {
  id: string;
  email: string;
  role: number;
};

function getBearerToken(request: FastifyRequest) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export async function requireAdminAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = getBearerToken(request);

  if (!token) {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Authorization token is required",
    });
  }

  try {
    const admin = jwt.verify(token, env.ADMIN_JWT_SECRET) as AdminTokenPayload;

    if (admin.role !== 1) {
      return reply.code(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "Admin access is required",
      });
    }
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Invalid or expired authorization token",
    });
  }
}