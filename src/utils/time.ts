import { AppError } from '../errors/AppError';

export function formatTimeUTC(ts: number): string {
  const date = new Date(Number(ts));

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      'Invalid timestamp provided',
      400
    );
  }

  return date.toLocaleTimeString('en-US', {
  timeZone: 'UTC',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  });
}
