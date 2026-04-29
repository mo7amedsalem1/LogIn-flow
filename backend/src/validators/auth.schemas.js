const { z } = require("zod");

const roleSchema = z.enum(["ADMIN", "MANAGER", "USER"]);

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password must be 128 characters or fewer")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/\d/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

const emailSchema = z
  .string()
  .trim()
  .email("A valid email address is required")
  .transform((value) => value.toLowerCase());

const inviteCodeSchema = z
  .string()
  .trim()
  .max(128)
  .optional()
  .transform((value) => value || undefined);

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema,
    roleEnrollmentCode: inviteCodeSchema,
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1).max(128),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const verifyTwoFactorSchema = z.object({
  body: z.object({
    twoFactorToken: z.string().min(20),
    code: z.string().regex(/^\d{6}$/, "2FA code must be a 6-digit value"),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyTwoFactorSchema,
};
