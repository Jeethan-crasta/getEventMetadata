import {buildApp} from './app';
 import 'dotenv/config'; 

async function start() {
  const app = buildApp();

  const PORT = Number(process.env.PORT) || 3000;

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    app.log.info(`Server started on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  process.exit(0);
});

start();