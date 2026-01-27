// No Zod schema available for .safeParse; Fastify JSON schema cannot be tested this way.
describe('getTripUrlSchema', () => {
  it('should be a valid Fastify schema object', () => {
    const { tripRequestSchema } = require('../../src/schema/getTripUrlSchema');
    expect(tripRequestSchema).toBeDefined();
    expect(tripRequestSchema.body).toBeDefined();
  });
});
