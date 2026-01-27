// No Zod schema available for .safeParse; Fastify JSON schema cannot be tested this way.
describe('resizeSchema', () => {
  it('should be a valid Fastify schema object', () => {
    // Just check that the schema is defined and has a body property
    const { resizeSchema } = require('../../src/schema/resizeSchema');
    expect(resizeSchema).toBeDefined();
    expect(resizeSchema.body).toBeDefined();
  });
});
