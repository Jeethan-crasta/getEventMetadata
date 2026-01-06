import 'dotenv/config';
import { buildApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const app = buildApp();

async function start() {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  app.log.info('Graceful shutdown');
  await app.close();
  process.exit(0);
});

start();
