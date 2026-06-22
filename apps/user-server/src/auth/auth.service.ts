import bcrypt from "bcrypt";
import { Prisma, prisma } from "@sportbooks/db";

import {
  type ForgotPasswordInput,
  type LoginInput,
  type SignupInput,
  type VerifyEmailInput,
  type VerifyOtpInput,
} from "./auth.schemas.js";
import { env } from "../config/env.js";
import { sendOtpEmail } from "../email/email.service.js";
import { generateOtp, storeOtp, verifyStoredOtp } from "./otp.store.js";
import { signUserToken, verifyUserToken } from "./jwt.js";
import { toUserResponse } from "../users/user.presenter.js";

const bcryptHashPattern = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const USER_ROLE = 7;

function createConflictError(message: string) {
  return Object.assign(new Error(message), {
    statusCode: 409,
  });
}

function createUnauthorizedRoleError() {
  return Object.assign(new Error("This account cannot be used on the user panel."), {
    statusCode: 403,
  });
}

export async function signupUser(input: SignupInput) {
  const rawPassword = input.password.trim();

  if (!rawPassword) {
    throw Object.assign(new Error('The "password" field cannot be empty.'), {
      statusCode: 400,
    });
  }

  const currency = input.currency
    ? await prisma.currency.findFirst({
        where: {
          OR: [{ name: input.currency }, { code: input.currency }],
        },
      })
    : null;

  if (input.currency && !currency) {
    throw Object.assign(
      new Error(`Currency "${input.currency}" does not exist.`),
      { statusCode: 400 },
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email },
        ...(input.username ? [{ username: input.username }] : []),
      ],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingUser?.email === input.email) {
    throw createConflictError("Email is already registered.");
  }

  if (input.username && existingUser?.username === input.username) {
    throw createConflictError("Username is already taken.");
  }

  const password = bcryptHashPattern.test(rawPassword)
    ? rawPassword
    : await bcrypt.hash(rawPassword, 12);

  const userCreateData: Prisma.UserCreateInput = {
      email: input.email,
      password,
      passwordText: rawPassword,
      role: USER_ROLE,
      ...(input.username !== undefined ? { username: input.username } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.birthdate !== undefined ? { birthdate: input.birthdate } : {}),
      ...(input.system_ip !== undefined ? { systemIp: input.system_ip } : {}),
      ...(input.browser_ip !== undefined ? { browserIp: input.browser_ip } : {}),
      ...(currency ? { currency: { connect: { id: currency.id } } } : {}),
  };

  const user = await prisma.user
    .create({
      data: userCreateData,
      include: { currency: true },
    })
    .catch((error: unknown) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw createConflictError("Email or username is already registered.");
      }

      throw error;
    });

  const loginHistoryCreateData: Prisma.LoginHistoryCreateInput = {
    user: { connect: { id: user.id } },
    email: input.email,
    createdAt: new Date(),
    lastLogin: new Date(),
    ...(input.system_ip !== undefined ? { systemIp: input.system_ip } : {}),
    ...(input.browser_ip !== undefined ? { browserIp: input.browser_ip } : {}),
  };

  await prisma.loginHistory.create({
    data: loginHistoryCreateData,
  });

  return {
    data: toUserResponse(user),
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: input.emailOrUsername.includes("@")
      ? { email: input.emailOrUsername }
      : { username: input.emailOrUsername },
    include: { currency: true },
  });

  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  if (user.role !== USER_ROLE) {
    throw createUnauthorizedRoleError();
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  if (!user.emailVerify) {
    throw Object.assign(new Error("Please verify your email before logging in."), {
      statusCode: 403,
    });
  }

  const token = signUserToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const loginHistoryWhere: Prisma.LoginHistoryWhereInput = {
      email: user.email,
      ...(input.system_ip !== undefined ? { systemIp: input.system_ip } : {}),
      ...(input.browser_ip !== undefined ? { browserIp: input.browser_ip } : {}),
  };

  const existingLoginHistory = await prisma.loginHistory.findFirst({
    where: loginHistoryWhere,
  });

  if (existingLoginHistory) {
    await prisma.loginHistory.update({
      where: { id: existingLoginHistory.id },
      data: { lastLogin: new Date() },
    });
  } else {
    const loginHistoryCreateData: Prisma.LoginHistoryCreateInput = {
      user: { connect: { id: user.id } },
      email: user.email,
      createdAt: new Date(),
      lastLogin: new Date(),
      ...(input.system_ip ?? user.systemIp
        ? { systemIp: input.system_ip ?? user.systemIp }
        : {}),
      ...(input.browser_ip ?? user.browserIp
        ? { browserIp: input.browser_ip ?? user.browserIp }
        : {}),
    };

    await prisma.loginHistory.create({
      data: loginHistoryCreateData,
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { token },
    include: { currency: true },
  });

  return {
    data: toUserResponse(updatedUser),
    token,
  };
}

export async function getUserProfile(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw Object.assign(new Error("Authorization token is required"), {
      statusCode: 401,
    });
  }

  const token = authHeader.substring("Bearer ".length).trim();
  const decoded = verifyUserToken(token);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: { currency: true },
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  if (user.role !== USER_ROLE) {
    throw createUnauthorizedRoleError();
  }

  return toUserResponse(user);
}

export async function sendVerificationOtp(input: VerifyEmailInput) {
  const otp = generateOtp();
  storeOtp(input.email, otp);

  await sendOtpEmail(input.email, otp, "email-verification");

  return {
    emailVerification: input.route === "VE",
    ...(env.EMAIL_DEV_OTP_RESPONSE ? { devOtp: otp } : {}),
  };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return {};
  }

  const otp = generateOtp();
  storeOtp(input.email, otp);

  await sendOtpEmail(input.email, otp, "password-reset");

  return env.EMAIL_DEV_OTP_RESPONSE ? { devOtp: otp } : {};
}

export async function verifyOtp(input: VerifyOtpInput) {
  const isValid = verifyStoredOtp(input.email, input.otp);

  if (!isValid) {
    throw Object.assign(new Error("Invalid or expired OTP"), {
      statusCode: 400,
    });
  }

  await prisma.user.updateMany({
    where: { email: input.email },
    data: { emailVerify: new Date() },
  });

  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { currency: true },
  });

  if (!user) {
    return { emailVerified: true };
  }

  if (user.role !== USER_ROLE) {
    return { emailVerified: true };
  }

  const token = signUserToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { token },
    include: { currency: true },
  });

  return {
    emailVerified: true,
    data: toUserResponse(updatedUser),
    token,
  };
}
