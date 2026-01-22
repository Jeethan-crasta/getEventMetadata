// src/routes/resize.ts
import { FastifyInstance } from 'fastify';
import { resizeAndUploadImage } from '../services/imageService';
import { resizeSchema } from '../schema/resizeSchema';
import { ResizeRequest } from '../types/resize';

export async function resizeRoute(app: FastifyInstance) {
  app.log.info('Route registered: POST /resize');
  
  app.post<{ Body: ResizeRequest }>(
    '/resize',
    { schema: resizeSchema },
    async (request, reply) => {
      await resizeAndUploadImage(request.body);

      return reply.code(200).send({
        status: 'ok',
        message: 'Image resized and uploaded successfully',
      });
    }
  );
}
