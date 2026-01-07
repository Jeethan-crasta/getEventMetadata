import { inflate } from 'zlib';
import { promisify } from 'util';
import { AppError } from '../errors/AppError';

const inflateAsync = promisify(inflate);

export async function maybeInflate(
  buffer: Buffer,
  fileName: string
): Promise<Buffer> {
  const needsInflation =
    fileName.endsWith('.zlib') || fileName.endsWith('.pbf.zlib');

  if (!needsInflation) {
    return buffer;
  }

  try {
    return await inflateAsync(buffer);
  } catch (err) {
    throw new AppError(
      'Failed to inflate compressed metadata',
      400,
      'METADATA_DECOMPRESSION_FAILED',
      err
    );
  }
}
