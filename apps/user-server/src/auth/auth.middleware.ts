import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { verifyUserToken, type AuthTokenPayload } from "./jwt.js";
import { env } from "../config/env.js";

type AdminTokenPayload = {
  id: string;
  email: string;
  role: number;
};

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthTokenPayload | AdminTokenPayload;
  }
}

function getBearerToken(request: FastifyRequest) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

function sendUnauthorized(reply: FastifyReply, message: string) {
  return reply.code(401).send({
    success: false,
    message,
    data: null,
    meta: { statusCode: 401 },
  });
}

export async function requireUserAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = getBearerToken(request);

  if (!token) {
    return sendUnauthorized(reply, "Authorization token is required");
  }

  try {
    const user = verifyUserToken(token);

    if (user.role !== 7) {
      return reply.code(403).send({
        success: false,
        message: "User access is required",
        data: null,
        meta: { statusCode: 403 },
      });
    }

    request.authUser = user;
  } catch {
    return sendUnauthorized(reply, "Invalid or expired authorization token");
  }
}

export async function requireAdminAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = getBearerToken(request);

  if (!token) {
    return sendUnauthorized(reply, "Authorization token is required");
  }

  try {
    const admin = jwt.verify(token, env.ADMIN_JWT_SECRET) as AdminTokenPayload;

    if (admin.role !== 1) {
      return reply.code(403).send({
        success: false,
        message: "Admin access is required",
        data: null,
        meta: { statusCode: 403 },
      });
    }

    request.authUser = admin;
  } catch {
    return sendUnauthorized(reply, "Invalid or expired authorization token");
  }
}