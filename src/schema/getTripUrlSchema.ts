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
  },

  response: {
    200: {
      type: 'object',
      required: ['fullPathAvailable','routePathInfo'],
      additionalProperties: false,
      properties: {
        fullPathAvailable: {
          type: 'boolean'
        },
        
        routePathInfo: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: [
              'timeOfDay',
              'timestampUTC',
              'latitude',
              'longitude',
              'speed',
              'bearing',
              'accuracy',
              'cameraConnectionState'
            ],
            additionalProperties: false,
            properties: {
              timeOfDay: { type: 'string' },
              timestampUTC: { type: 'number' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
              speed: { type: 'number' },
              bearing: { type: 'number' },
              accuracy: { type: 'number' },
              cameraConnectionState: {
                type: 'string',
                enum: ['CONNECTED', 'DISCONNECTED']
              }
            }
          }
        },

        polylinePathInfo: {
          type: 'string',
          description: 'Encoded polyline string. Present only when responseFormat is POLYLINE'
        }
      }
    }
  }
};
