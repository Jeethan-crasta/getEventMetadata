import Fastify, { FastifyInstance } from 'fastify';
import { eventMetadataRoute } from './routes/eventMetadataRoute';
import { errorHandler } from './errors/errorHandler';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },

    // Network safety
    connectionTimeout: 10_000, // TCP handshake timeout
    requestTimeout: 15_000,    // total request lifecycle
    keepAliveTimeout: 60_000,  // keep-alive sockets
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


  app.addHook('onClose', async (instance) => {
    instance.log.info('Fastify instance shutting down');
  });

  return app;
}
