import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

import { env } from "../config/env.js";

type OtpEmailPurpose = "email-verification" | "password-reset";

function hasSmtpConfig() {
  return Boolean(
    env.SMTP_HOST &&
      env.SMTP_PORT &&
      env.SMTP_USERNAME &&
      env.SMTP_PASSWORD &&
      env.SMTP_FROM_MAIL,
  );
}

function createEmailError(message: string, cause?: unknown) {
  return Object.assign(new Error(message), {
    statusCode: 503,
    cause,
  });
}

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;

function getTransporter() {
  if (!hasSmtpConfig()) {
    throw createEmailError(
      "Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, and SMTP_FROM_MAIL.",
    );
  }

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

function getOtpSubject(purpose: OtpEmailPurpose) {
  if (purpose === "password-reset") {
    return "Password Reset OTP || Sportsbook";
  }

  return "E-mail Verification OTP || Sportsbook";
}

function getOtpIntro(purpose: OtpEmailPurpose) {
  if (purpose === "password-reset") {
    return "Your One-Time Password (OTP) for password reset is:";
  }

  return "Your One-Time Password (OTP) for email verification is:";
}

export async function sendOtpEmail(
  toMailId: string,
  otp: string,
  purpose: OtpEmailPurpose,
) {
  try {
    await getTransporter().sendMail({
      from: env.SMTP_FROM_MAIL,
      to: toMailId,
      subject: getOtpSubject(purpose),
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2e86de; margin-bottom: 4px;">Sportsbook</h2>
            <p style="color: #555; margin-top: 8px;">${purpose === "password-reset" ? "Password Reset" : "Email Verification"}</p>
          </div>
          <div style="font-size: 16px; color: #333;">
            <p>Dear User,</p>
            <p>${getOtpIntro(purpose)}</p>
            <p style="text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2e86de;">${otp}</p>
            <p style="margin-top: 20px;">This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <hr style="margin: 30px 0;" />
          <div style="text-align: center; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} Sportsbook. All rights reserved.
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    throw createEmailError("Failed to send OTP email. Please check SMTP configuration.", error);
  }
}
