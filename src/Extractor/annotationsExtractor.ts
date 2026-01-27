import { AppError } from '../errors/AppError';
import { EventMetadataMessage,EventMetadataResult,} from '../types/extractorsTypes';

export function extractAnnotationsMetadata(
  message: EventMetadataMessage
): EventMetadataResult[] {
  try {
    if (!Array.isArray(message?.aiMetaData)) {
      throw new AppError(
        'Invalid protobuf payload: aiMetaData is missing or malformed',
        400,
        'INVALID_ANNOTATIONS_DATA'
      );
    }

    return message.aiMetaData.map(({ timestamp, ...rest }) => ({
      ...rest,
      timestampUTC: Number(timestamp),
    }));
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      'Failed to extract annotations metadata',
      500,
      'ANNOTATION_EXTRACTOR_ERROR',
      err
    );
  }
}
