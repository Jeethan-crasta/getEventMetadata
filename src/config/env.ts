import dotenv from 'dotenv';
import { AppError } from '../errors/AppError';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  SERVER_PORT: Number(process.env.SERVER_PORT ?? 3000),
  SERVER_HOST: process.env.SERVER_HOST ?? '0.0.0.0',

  AWS_REGION: process.env.AWS_REGION ?? 'us-east-1',

  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
};

function validateEnv() {
  console.info('[ENV] Validating environment variables');

  if (Number.isNaN(env.SERVER_PORT)) {
    const err = new AppError(
      'SERVER_PORT must be a valid number',
      500
    );
    console.error('[ENV] Invalid SERVER_PORT', err);
    throw err;
  }

  if (!env.AWS_REGION) {
    const err = new AppError(
      'AWS_REGION is required',
      500
    );
    console.error('[ENV] Missing AWS_REGION', err);
    throw err;
  }

  console.info('[ENV] Environment variables validated successfully', {
    NODE_ENV: env.NODE_ENV,
    SERVER_PORT: env.SERVER_PORT,
    AWS_REGION: env.AWS_REGION,
    LOG_LEVEL: env.LOG_LEVEL,
  });
}

validateEnv();
