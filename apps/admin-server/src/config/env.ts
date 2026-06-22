import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import z from "zod";


const currentDir = dirname(fileURLToPath(import.meta.url));


config({path:resolve(currentDir,'../../../../.env')})



const envSchema = z.object({
  ADMIN_SERVER_PORT: z.coerce.number().int().positive().default(3030),
  ADMIN_CORS_ORIGINS: z.string().default("http://localhost:5173"),
  ADMIN_JWT_SECRET : z.string().default('xfair91@dubai'),
  ADMIN_JWT_EXPIRES_IN : z.string().default('6h'),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.ADMIN_CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);