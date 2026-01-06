import { FastifyReply, FastifyRequest } from 'fastify';
import { getEventMetadata } from '../services/eventMetadata.service';
import { EventMetadataRequest } from '../types/eventMetadata';

export async function eventMetadataController(
  request: FastifyRequest<{ Body: EventMetadataRequest }>,
  reply: FastifyReply
) {
  const result = await getEventMetadata(request.body);
  reply.status(200).send(result);
}
