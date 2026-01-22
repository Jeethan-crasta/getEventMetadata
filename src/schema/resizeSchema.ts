export const resizeSchema = {
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
};
