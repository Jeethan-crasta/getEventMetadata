import { FastifyInstance } from 'fastify';
import { eventMetadataSchema } from '../fastifyschema/eventMetadataSchema';
import { eventMetadataController } from '../controller/eventMetadata.controller';

export async function eventMetadataRoute(app: FastifyInstance) {
  app.post(
    '/event-metadata',
    { schema: eventMetadataSchema },
    eventMetadataController
  );
}
