import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eventMetadataSchema } from '../schema/eventMetadataSchema';
import { EventMetadataService } from '../services/eventMetadataService';
import { EventMetadataRequest } from '../types/eventMetadata';

const service = new EventMetadataService();

export async function eventMetadataRoute(app: FastifyInstance) {
  app.log.info('Route registered: POST /event-metadata');

  app.post(
    '/event-metadata',
    { schema: eventMetadataSchema },
    async (
      request: FastifyRequest<{ Body: EventMetadataRequest }>,
      reply: FastifyReply
    ) => {
      request.log.info(
        { body: request.body },
        'Processing /event-metadata request'
      );

      const result = await service.process(request.body);
      return reply.code(200).send(result);
    }
  );
}
