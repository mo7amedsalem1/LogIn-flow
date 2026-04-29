const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_PREAUTH_SECRET: z
    .string()
    .min(32, "JWT_PREAUTH_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_PREAUTH_EXPIRES_IN: z.string().default("5m"),
  JWT_ISSUER: z.string().min(1).default("secure-auth-platform"),
  JWT_AUDIENCE: z.string().min(1).default("secure-auth-frontend"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  TWO_FA_APP_NAME: z.string().min(1).default("Secure Auth Platform"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  MANAGER_ROLE_SETUP_CODE: z.string().min(8).optional(),
  ADMIN_ROLE_SETUP_CODE: z.string().min(8).optional(),
  ENCRYPTION_KEY: z
    .string()
    .regex(
      /^[a-fA-F0-9]{64}$/,
      "ENCRYPTION_KEY must be a 64-character hex string",
    ),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

module.exports = {
  env: parsed.data,
};
