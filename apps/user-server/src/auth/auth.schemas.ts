import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email(),
  birthdate: z.coerce.date().optional(),
  password: z.string().min(1),
  system_ip: z.string().optional(),
  browser_ip: z.string().optional(),
  currency: z.string().optional(),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
  system_ip: z.string().optional(),
  browser_ip: z.string().optional(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  route: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
