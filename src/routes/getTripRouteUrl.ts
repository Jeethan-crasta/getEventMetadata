import { FastifyInstance } from 'fastify';
import { getTripPath } from '../services/tripService';
import { TripRequest } from '../types/tripTypes';
import { tripRequestSchema } from '../schema/getTripUrlSchema';

export default async function tripRoutes(app: FastifyInstance) {
  app.log.info('Route registered: POST /get_trip_path');
  
  app.post<{ Body: TripRequest }>(
    '/get_path',
    { schema: tripRequestSchema },
    async (request, reply) => {
      const result = await getTripPath(request.body);

      
      return reply.status(200).send(result);
    }
  );
}
