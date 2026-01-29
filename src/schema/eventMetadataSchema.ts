import { FastifySchema } from 'fastify';

export const eventMetadataSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['bucket', 'url', 'region'],
    additionalProperties: false,

    properties: {
      bucket: {type: 'string',minLength: 1,},

      url: {type: 'string',minLength: 1,},

      region: {type: 'string',minLength: 1,},

      videoStartTimeUTC: {type: 'number',minimum: 0},

      videoEndTimeUTC: {type: 'number',minimum: 0},

      options: {
        type: 'object',
        additionalProperties: false,
        nullable: false,

        properties: {
          includeInertialSensorData: { type: 'boolean' },
          includeRawInertialSensorData: { type: 'boolean' },
          includeAnnotationsMetadata: { type: 'boolean' },
          includePathInfo: { type: 'boolean' },
        },
      },
    },
  },


  response: {
    200: {
      type: 'object',
      required: ['accelerometerData', 'annotationsMetadata', 'pathInfo'],
      properties: {
        accelerometerData: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
        annotationsMetadata: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
        pathInfo: {
          type: 'object',
          required: ['routePathInfo'],
          additionalProperties: true,
          properties: {
            routePathInfo: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
  },
};
