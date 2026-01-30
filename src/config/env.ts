import { AppError } from '../errors/AppError';

export const env = {
  SERVER_PORT: Number(process.env.SERVER_PORT ?? 3000),
  SERVER_HOST: process.env.SERVER_HOST ?? '0.0.0.0',

  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN ?? '',
};

function validateEnv() {
  if (Number.isNaN(env.SERVER_PORT)) {
    throw new AppError('SERVER_PORT must be a valid number', 500);
  }

  console.info('[ENV] Environment validated', {
    SERVER_PORT: env.SERVER_PORT,
    SERVER_HOST: env.SERVER_HOST,
  });
}

validateEnv();
