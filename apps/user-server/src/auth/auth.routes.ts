import type { FastifyInstance } from "fastify";
import { requireUserAuth } from "./auth.middleware.js";

import {
  forgotPassword,
  getProfile,
  login,
  signup,
  verifyEmail,
  verifyOtp,
} from "./auth.controller.js";

export async function authRoutes(server: FastifyInstance) {
  server.post("/auth/signup", signup);
  server.post("/auth/login", login);
  server.post("/auth/verify-email", verifyEmail);
  server.post("/auth/forgot-password", forgotPassword);
  server.post("/auth/verify-otp", verifyOtp);
  server.get("/me", { preHandler: requireUserAuth }, getProfile);

  server.post("/users/signup", signup);
  server.post("/users/login", login);
  server.post("/users/verifyemail", verifyEmail);
  server.post("/users/forget-password", forgotPassword);
  server.post("/users/verify-otp", verifyOtp);
  server.get("/users/profile", { preHandler: requireUserAuth }, getProfile);
}
