import { BufferReader } from '../../src/utils/buffer-reader';

describe('BufferReader', () => {
  it('reads int correctly', () => {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(42, 0);

    const reader = new BufferReader(buf);
    expect(reader.readInt()).toBe(42);
  });

  it('throws on buffer underflow', () => {
    const reader = new BufferReader(Buffer.alloc(2));
    expect(() => reader.readInt()).toThrow();
  });
});
