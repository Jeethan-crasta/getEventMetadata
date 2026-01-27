import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './AppError';

export function errorHandler(error: FastifyError | AppError,_req: FastifyRequest,reply: FastifyReply) {
  if (typeof error === 'object' && error !== null && 'validation' in error) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message,
    });
  }

  if (error instanceof AppError) {
    
    if (error.statusCode >= 500) {
      reply.log.error(
        { err: error.cause ?? error },
        error.message
      );
    }

    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      code: error.code,
      error: error.message,
    });
  }

  reply.log.error({ err: error }, 'Unhandled error');

  return reply.status(500).send({
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    error: 'Internal Server Error',
  });
}
