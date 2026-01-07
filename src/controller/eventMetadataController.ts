import { FastifyRequest, FastifyReply } from 'fastify';
import { EventMetadataService } from '../services/eventMetadataService';
import { EventMetadataRequest } from '../types/eventMetadata';

const service = new EventMetadataService();

export async function eventMetadataController(
  request: FastifyRequest<{ Body: EventMetadataRequest }>,
  reply: FastifyReply
) {
  request.log.info(
    { body: request.body },
    'Processing /event-metadata request'
  );

  const result = await service.process(request.body);

  return reply.code(200).send(result);
}
