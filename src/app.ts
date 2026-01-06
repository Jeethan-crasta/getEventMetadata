import Fastify from 'fastify';
import { eventMetadataRoute } from './routes/eventMetadata.route';
import { errorHandler } from './errors/errorHandler';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Routes
  app.register(eventMetadataRoute);

  // Global error handler
  app.setErrorHandler(errorHandler);

  return app;
}
