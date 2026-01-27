import Fastify, { FastifyInstance } from 'fastify';
import { env } from './config/env';
import { eventMetadataRoute } from './routes/eventMetadataRoute';
import { errorHandler } from './errors/errorHandler';
import tripRoutes from './routes/getTripRouteUrl';
import { resizeRoute } from './routes/imageResizeRoute';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  app.setErrorHandler(errorHandler);

  app.get('/health', async (request) => {
    app.log.info(`Health check requested from ${request.ip}`);
    return { status: 'ok' };
  });

  app.register(eventMetadataRoute,{prefix:'/v1/lambda'});
  app.register(tripRoutes, { prefix: '/v1/lambda' });
  app.register(resizeRoute,{prefix: '/v1/lambda'});

  app.addHook('onClose', async (instance) => {
    instance.log.info('Fastify instance shutting down');
  });

  return app;
}
