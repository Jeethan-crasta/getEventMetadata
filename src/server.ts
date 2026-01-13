import 'dotenv/config';
import { buildApp } from './app';
import { ProtobufService } from './services/protobufService';

const PORT = Number(process.env.SERVER_PORT ?? 3000);
const HOST = process.env.SERVER_HOST ?? '0.0.0.0';

async function start() {
  const app = buildApp();
  
  try {
    await ProtobufService.init();
    await app.listen({ port: PORT, host: HOST });
    app.log.info(` Server listening on ${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err, 'Failed to start server');
    process.exit(1);
  }
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
}

start();
