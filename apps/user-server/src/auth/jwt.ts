import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AuthTokenPayload = {
  id: string;
  email: string;
  role: number;
  name?: string | null;
};

export function signUserToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.USER_JWT_SECRET, {
    expiresIn: env.USER_JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyUserToken(token: string) {
  return jwt.verify(token, env.USER_JWT_SECRET) as AuthTokenPayload;
}
