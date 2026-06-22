import type { FastifyReply, FastifyRequest } from "fastify";
import { listEventsForSport, type EventStatusQuery } from "../../services/event.service.js";

type EventParams = {
    sportKey: string;
}

type EventQuery = {
    status?: EventStatusQuery;
    limit?: number;
    offset?: number;
}

export async function getEvents(request: FastifyRequest<{ Params: EventParams; Querystring: EventQuery }>, reply: FastifyReply) {
const events = await listEventsForSport({
    sportKey: request.params.sportKey,
    status: request.query.status ?? 'all',
    limit: request.query.limit ?? 50,
    offset: request.query.offset ?? 0,
});

return reply.code(200).send(events);
}

export async function getLiveEvents(request: FastifyRequest<{ Params: EventParams }>, reply: FastifyReply) {
const events = await listEventsForSport({
    sportKey: request.params.sportKey,
    status: "live",
    limit: 50,
    offset: 0,
});
return reply.code(200).send(events);
}