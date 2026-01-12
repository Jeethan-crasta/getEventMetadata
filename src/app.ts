import Fastify from 'fastify';
import { eventMetadataRoute } from './routes/eventMetadataRoute';
import { errorHandler } from './errors/errorHandler';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
    connectionTimeout: 10_000, // TCP handshake timeout
    requestTimeout: 15_000,    // total request time
  });

  // Global error handler (register early)
  app.setErrorHandler(errorHandler);

  // Health check
  app.get('/health', async (request) => {
    request.log.debug('Health check requested');
    return { status: 'ok' };
  });

  // Routes
  app.register(eventMetadataRoute);

  return app;
}
