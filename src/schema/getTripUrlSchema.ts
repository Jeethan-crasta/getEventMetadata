import { FastifySchema } from 'fastify';

export const tripRequestSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['s3UrlListData'],
    additionalProperties: false,
    properties: {
      s3UrlListData: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['region', 'bucket', 'key'],
          additionalProperties: false,
          properties: {
            region: { type: 'string', minLength: 1 },
            bucket: { type: 'string', minLength: 1 },
            key: { type: 'string', minLength: 1 }
          }
        }
      },

      responseFormat: {
        type: 'string',
        enum: ['RAW', 'POLYLINE'],
        description: 'Response format for route path'
      }
    }
  }
};
