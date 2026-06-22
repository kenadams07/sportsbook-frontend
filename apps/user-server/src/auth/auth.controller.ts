import type { FastifyReply, FastifyRequest } from "fastify";

import {
  forgotPassword as forgotPasswordService,
  getUserProfile,
  loginUser,
  sendVerificationOtp,
  signupUser,
  verifyOtp as verifyOtpService,
} from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
  verifyEmailSchema,
  verifyOtpSchema,
} from "./auth.schemas.js";
import { errorResponse, successResponse } from "../utils/response.js";

function getStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function signup(request: FastifyRequest, reply: FastifyReply) {
  try {
    const input = signupSchema.parse(request.body);
    const result = await signupUser(input);

    return reply
      .code(201)
      .send(successResponse("Signup successful. Please verify your email.", {
        user: result.data,
      }, 201));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const input = loginSchema.parse(request.body);
    const result = await loginUser(input);

    return reply.code(200).send(
      successResponse("Login successful.", {
        user: result.data,
        token: result.token,
      }),
    );
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function getProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = await getUserProfile(request.headers.authorization);

    return reply
      .code(200)
      .send(successResponse("Profile retrieved successfully", data, 200));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function verifyEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const input = verifyEmailSchema.parse(request.body);
    const data = await sendVerificationOtp(input);

    return reply
      .code(200)
      .send(successResponse("OTP sent successfully", data, 200));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const input = forgotPasswordSchema.parse(request.body);
    const data = await forgotPasswordService(input);

    return reply
      .code(200)
      .send(
        successResponse(
          "If the email exists, a password reset link has been sent",
          data,
          200,
        ),
      );
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function verifyOtp(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const input = verifyOtpSchema.parse(request.body);
    const result = await verifyOtpService(input);
    const data =
      "token" in result && result.token && "data" in result
        ? {
            emailVerified: result.emailVerified,
            user: result.data,
            token: result.token,
          }
        : result;

    return reply
      .code(200)
      .send(successResponse("Email verified successfully", data, 200));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}
