export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code = 'APP_ERROR',
    cause?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.cause = cause;

    Error.captureStackTrace(this, this.constructor);
  }
}
