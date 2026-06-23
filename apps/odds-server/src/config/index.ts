import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, "../../../../.env"), quiet: true });

const envSchema = z
  .object({
  ODDS_API_KEY: z.string().default(""),
  ODDS_API_BASE_URL: z.string().url(),

  REDIS_HOST: z.string().min(1).default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  DATABASE_URL: z.string().min(1),

  PORT: z.coerce.number().int().positive().default(3010),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  QUOTA_PAUSE_THRESHOLD: z.coerce.number().int().positive().default(50),
  QUOTA_HALT_THRESHOLD: z.coerce.number().int().positive().default(10),

  POLL_INTERVAL_LIVE: z.coerce.number().int().positive().default(5000),
  POLL_INTERVAL_SOON: z.coerce.number().int().positive().default(15000),
  POLL_INTERVAL_PREMATCH: z.coerce.number().int().positive().default(30000),

  BULL_CONCURRENCY: z.coerce.number().int().positive().default(3),

  FAKE_ODDS_ENABLED: z.coerce.boolean().default(false),
  FAKE_ODDS_INTERVAL_MS: z.coerce.number().int().positive().default(2000),
  FAKE_ODDS_SPORTS: z.string().default(""),
  EVENT_SYNC_INTERVAL_MS: z.coerce.number().int().positive().default(1800000),
  ODDS_CORS_ORIGINS: z.string().default("http://localhost:9001"),
  ADMIN_JWT_SECRET: z.string().min(1).default("xfair91@dubai"),
})
  .superRefine((env, ctx) => {
    if (!env.FAKE_ODDS_ENABLED && env.ODDS_API_KEY.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ODDS_API_KEY"],
        message: "ODDS_API_KEY is required when FAKE_ODDS_ENABLED is false",
      });
    }
  });

export const env = envSchema.parse(process.env);

export const corsOrigins = env.ODDS_CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
