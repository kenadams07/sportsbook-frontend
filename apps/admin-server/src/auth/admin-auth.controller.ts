import { FastifyReply, FastifyRequest } from "fastify";
import { adminLoginSchema } from "./admin-auth.schema.js";
import { loginAdmin } from "./admin-auth.service.js";
import { sendSuccess } from "../api/response.js";

export async function adminLoginController(request:FastifyRequest,
    reply:FastifyReply,
){
    const input = adminLoginSchema.parse(request.body);
    const result  = await loginAdmin(input);

    return sendSuccess(reply,result,"Admin Login Successfull")
}