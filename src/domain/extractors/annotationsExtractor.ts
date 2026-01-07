import { AppError } from '../../errors/AppError';

export function extractAnnotationsMetadata(message: any) {
  if (!Array.isArray(message?.aiMetaData)) {
    throw new AppError(
      'Invalid protobuf payload: aiMetaData is missing or malformed',
      400
    );
  }

  if (message.aiMetaData.length === 0) {
    return [];
  }

  return message.aiMetaData.map((annotation: any) => {
    const { timestamp, ...rest } = annotation;

    return {
      ...rest,
      timestampUTC: Number(timestamp),
    };
  });
}
