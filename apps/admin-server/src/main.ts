import { connectDb, disconnectDb } from "@sportbooks/db";

import { buildServer } from "./api/server.js";
import { env } from "./config/env.js";
import { registerErrorHandler } from "./api/error-handler.js";

const server = await buildServer();

async function shutdown(signal: string) {
  server.log.info({ signal }, "shutting down admin server");

  await Promise.allSettled([
    server.close(),
    disconnectDb(),
  ]);

  process.exit(0);
}



registerErrorHandler(server);


process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

async function bootstrap() {
  await connectDb();
  server.log.info("postgres connected");

  await server.listen({
    host: "0.0.0.0",
    port: env.ADMIN_SERVER_PORT,
  });

  server.log.info(
    { port: env.ADMIN_SERVER_PORT },
    "admin server ready",
  );
}

bootstrap().catch((error) => {
  server.log.error({ error }, "failed to start admin server");
  process.exit(1);
});