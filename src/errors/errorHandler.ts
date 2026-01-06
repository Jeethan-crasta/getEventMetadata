import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './AppError';

export function errorHandler(
  error: FastifyError | AppError,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  // Fastify validation errors
  if (
    typeof error === 'object' &&
    error !== null &&
    'validation' in error
  ) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message,
    });
  }

  // Domain errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.message,
    });
  }

  // Unknown errors
  reply.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
  });
}
