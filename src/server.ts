import { buildApp } from './app';
import { ProtobufLoader } from './utils/protobufLoader';
import { env } from './config/env';

const { SERVER_PORT: PORT, SERVER_HOST: HOST } = env;

async function start() {
  const app = buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Shutdown signal received');

    try {
      await app.close();
      app.log.info('HTTP server closed cleanly');
      process.exit(0);
    } catch (err) {
      app.log.error(err, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  try {
    await ProtobufLoader.init();
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server listening on ${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err, 'Failed to start server');
    process.exit(1);
  }
}

start();
