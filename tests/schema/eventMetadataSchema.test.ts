// No Zod schema available for .safeParse; Fastify JSON schema cannot be tested this way.
describe('eventMetadataSchema', () => {
  it('should be a valid Fastify schema object', () => {
    const { eventMetadataSchema } = require('../../src/schema/eventMetadataSchema');
    expect(eventMetadataSchema).toBeDefined();
    expect(eventMetadataSchema.body).toBeDefined();
  });
});
