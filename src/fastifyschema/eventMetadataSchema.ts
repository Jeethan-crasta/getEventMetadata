// AJV schema for /event-metadata POST endpoint
export const eventMetadataSchema = {
  body: {
    type: 'object',
    required: ['bucket', 'url', 'region'],
    properties: {
      bucket: { type: 'string', minLength: 1 },
      url: { type: 'string', minLength: 1 },
      region: { type: 'string', minLength: 1 },
      accBinFileVersionOverride: { type: ['string', 'number'], nullable: true },
      videoStartTimeUTC: { type: ['number', 'null'], nullable: true },
      videoEndTimeUTC: { type: ['number', 'null'], nullable: true },
      options: {
        type: 'object',
        properties: {
          includeInertialSensorData: { type: 'boolean' },
          includeAnnotationsMetadata: { type: 'boolean' },
          includePathInfo: { type: 'boolean' },
          includeRawInertialSensorData: { type: 'boolean' }
        },
        additionalProperties: true,
        nullable: true
      }
    },
    additionalProperties: false
  }
};
