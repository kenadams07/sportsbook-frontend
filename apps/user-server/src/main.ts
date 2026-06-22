import { buildServer } from "./api/server.js";
import { env } from "./config/env.js";
import { connectDb, disconnectDb } from "@sportbooks/db";

const server = await buildServer();

async function shutdown(signal: string) {
  server.log.info({ signal }, "shutting down user server");
  await Promise.allSettled([server.close(), disconnectDb()]);
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

async function bootstrap() {
  await connectDb();
  server.log.info("postgres connected");

  await server.listen({ host: "0.0.0.0", port: env.USER_SERVER_PORT });
  server.log.info({ port: env.USER_SERVER_PORT }, "user server ready");
}

bootstrap().catch((error) => {
  server.log.error({ error }, "failed to start user server");
  process.exit(1);
});
