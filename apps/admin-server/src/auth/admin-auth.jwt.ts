import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AdminJwtPayload = {
  id: string;
  email: string;
  role: number;
};

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, env.ADMIN_JWT_SECRET, {
    expiresIn:
      env.ADMIN_JWT_EXPIRES_IN as NonNullable<
        jwt.SignOptions["expiresIn"]
      >,
  });
}