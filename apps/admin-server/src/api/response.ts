import { FastifyReply } from "fastify";
import { success } from "zod";

type ResponseMeta = Record<string, unknown>;

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  message = "Request Completed Successfully",
  statusCode = 200,
  meta: ResponseMeta = {},
) {
  return reply
    .code(statusCode)
    .send({ success: true, message, data, meta: {statusCode, ...meta},
     });
}

export function sendError(reply:FastifyReply,message:string,statusCode=500,meta:ResponseMeta = {}){
    return reply.code(statusCode).send({success:false,message,data:null,meta:{
        statusCode,
        ...meta
    }})
}

