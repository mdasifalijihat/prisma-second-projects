import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      await transporter.sendMail({
        from: `"Prisma Blog" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: "Verify your email",
        html: `
         <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">

      <h2 style="color: #333; text-align: center;">Verify Your Email</h2>

      <p style="color: #555; font-size: 14px;">
        Hi ${user.name || "there"},
      </p>

      <p style="color: #555; font-size: 14px;">
        Thanks for signing up to <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${verificationUrl}"
          style="
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
          "
          target="_blank"
        >
          Verify Email
        </a>
      </div>

      <p style="color: #777; font-size: 12px;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 12px; word-break: break-all; color: #2563eb;">
        ${verificationUrl}
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />

      <p style="color: #999; font-size: 12px; text-align: center;">
        If you didn’t create an account, you can safely ignore this email.
      </p>

    </div>
  </div>
  `,
      });

      console.log(`Verification email sent to ${user.email}: ${url}`);
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        default: "user",
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        default: "active",
      },
    },
  },
});
