import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, "../../../../.env"), quiet: true });

const envSchema = z.object({
  USER_SERVER_PORT: z.coerce.number().int().positive().default(3020),
  USER_JWT_SECRET: z.string().default("dev-user-secret"),
  USER_JWT_EXPIRES_IN: z.string().default("6h"),
  ADMIN_JWT_SECRET: z.string().min(1).default("xfair91@dubai"),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USERNAME: z.string().default(""),
  SMTP_PASSWORD: z.string().default(""),
  SMTP_FROM_MAIL: z.string().default(""),
  EMAIL_DEV_OTP_RESPONSE: z.coerce.boolean().default(true),
  USER_CORS_ORIGINS: z
    .string()
    .default(
      "https://user-api.xfair91.com,http://user-api.xfair91.com,https://xfair91.com,http://localhost:3000,http://localhost:3001,http://localhost:5002",
    ),
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.USER_CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
