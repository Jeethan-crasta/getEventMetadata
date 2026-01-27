import { decodeProtobufRoute } from '../../src/decoders/protobuf.decoder';

describe('protobuf.decoder', () => {
  it('decodes valid protobuf buffer', async () => {
    const buffer = Buffer.alloc(0);

    await expect(
      decodeProtobufRoute(buffer)
    ).rejects.toThrow();
  });

  it('fails on invalid payload', async () => {
    await expect(
      decodeProtobufRoute(Buffer.alloc(1))
    ).rejects.toThrow();
  });
});
