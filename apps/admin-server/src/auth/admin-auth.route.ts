import type {FastifyInstance} from "fastify";
import { adminLoginController } from "./admin-auth.controller.js";

export async function registerAdminAuthRoutes(server:FastifyInstance) {
    server.post('/admin/auth/login',adminLoginController)
}