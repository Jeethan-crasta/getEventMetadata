import { FastifyInstance } from 'fastify';
import { eventMetadataSchema } from '../schema/eventMetadataSchema';
import { processEventMetadata } from '../services/eventMetadataService';
import { EventMetadataRequest } from '../types/eventMetadata';

export async function eventMetadataRoute(app: FastifyInstance) {
  app.log.info('Route registered: POST /event-metadata');

  app.post<{ Body: EventMetadataRequest }>(
    '/event_metadata',
    { schema: eventMetadataSchema },
    async (request, reply) => {
      request.log.info(
        { body: request.body },
        'Processing /event-metadata request'
      );

      const result = await processEventMetadata(request.body);
      return reply.code(200).send(result);
    }
  );
}
