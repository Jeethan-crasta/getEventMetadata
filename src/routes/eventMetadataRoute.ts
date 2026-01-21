import { FastifyInstance } from 'fastify';
import { eventMetadataSchema } from '../schema/eventMetadataSchema';
import { eventMetadataController } from '../controller/eventMetadataController';

export async function eventMetadataRoute(app: FastifyInstance) {
  app.log.info('Route registered: POST /event-metadata');

  app.post(
    '/event-metadata',
    { schema: eventMetadataSchema },
    eventMetadataController
  );
}
