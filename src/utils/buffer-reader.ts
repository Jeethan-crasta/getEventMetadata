import { AppError } from '../errors/AppError';

export class BufferReader {
  private buffer: Buffer;
  private offset = 0;

  constructor(buffer: Buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new AppError(
        'Invalid buffer provided',
        400,
        'INVALID_BUFFER'
      );
    }

    this.buffer = buffer;
  }

  private ensureAvailable(bytes: number) {
    if (this.offset + bytes > this.buffer.length) {
      throw new AppError(
        'Buffer underflow while reading data',
        400,
        'BUFFER_UNDERFLOW'
      );
    }
  }

  readShort(): number {
    try {
      this.ensureAvailable(2);
      const value = this.buffer.readInt16BE(this.offset);
      this.offset += 2;
      return value;
    } catch (err) {
      throw new AppError(
        'Failed to read short from buffer',
        400,
        'BUFFER_READ_SHORT_FAILED',
        err
      );
    }
  }

  readInt(): number {
    try {
      this.ensureAvailable(4);
      const value = this.buffer.readInt32BE(this.offset);
      this.offset += 4;
      return value;
    } catch (err) {
      throw new AppError(
        'Failed to read int from buffer',
        400,
        'BUFFER_READ_INT_FAILED',
        err
      );
    }
  }

  readLong(): number {
    try {
      this.ensureAvailable(8);
      const high = this.buffer.readInt32BE(this.offset);
      const low = this.buffer.readInt32BE(this.offset + 4);
      this.offset += 8;

      return high * 4294967296 + (low >>> 0);
    } catch (err) {
      throw new AppError(
        'Failed to read long from buffer',
        400,
        'BUFFER_READ_LONG_FAILED',
        err
      );
    }
  }

  readByte(): number {
    try {
      this.ensureAvailable(1);
      const value = this.buffer.readUInt8(this.offset);
      this.offset += 1;
      return value;
    } catch (err) {
      throw new AppError(
        'Failed to read byte from buffer',
        400,
        'BUFFER_READ_BYTE_FAILED',
        err
      );
    }
  }

  increment(bytes: number): void {
    this.ensureAvailable(bytes);
    this.offset += bytes;
  }

  isOpen(nextBytes = 0): boolean {
    return this.offset + nextBytes <= this.buffer.length;
  }
}
