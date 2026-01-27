import { decodeBinaryRoute } from '../../src/decoders/binary.decoder';

describe('binary.decoder', () => {
  it('decodes valid binary payload', () => {
    const buffer = Buffer.from([0x00, 0x01, 0x02]);

    
    const result = decodeBinaryRoute(buffer, 4);

    expect(result).toBeDefined();
  });

  it('returns empty array on empty buffer', () => {
    expect(decodeBinaryRoute(Buffer.alloc(0), 4)).toEqual([]);
  });
});
