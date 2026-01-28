import { FastifySchema } from 'fastify';

export const resizeSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['source', 'target'],
    properties: {
      source: {
        type: 'object',
        required: ['bucket', 'key', 'region'],
        properties: {
          bucket: { type: 'string' },
          key: { type: 'string' },
          region: { type: 'string' },
        },
      },
      target: {
        type: 'object',
        required: ['bucket', 'key', 'region', 'width'],
        properties: {
          bucket: { type: 'string' },
          key: { type: 'string' },
          region: { type: 'string' },
          width: { type: 'integer' },
        },
      },
    },
  },

  response: {
    200: {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: { type: 'string', example: 'ok' },
        message: {
          type: 'string',
          example: 'Image resized and uploaded successfully',
        },
      },
    },
  },
};
