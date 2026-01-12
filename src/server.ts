import 'dotenv/config';
import { buildApp } from './app';
import { ProtobufService } from './services/protobufService';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const app = buildApp();

async function start() {
  try {
    await ProtobufService.init();
    await app.listen({ port: PORT, host: HOST });
    app.log.info({ port: PORT }, 'Server started');
  } catch (err) {
    app.log.error(err, 'Failed to start server');
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  app.log.info('SIGTERM received, shutting down gracefully');

  try {
    await app.close();
    app.log.info('Server closed');
  } catch (err) {
    app.log.error(err, 'Error during shutdown');
  } finally {
    process.exit(0);
  }
});

start();
