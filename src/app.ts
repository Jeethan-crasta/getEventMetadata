import Fastify from "fastify";

export function buildApp() {
  const app = Fastify({ logger: true });

//   app.register(errorHandler);
//   app.register(dbPlugin);
//   app.register(swaggerPlugin);
//   app.register(userRoutes, { prefix: "/api" });

  return app;
}