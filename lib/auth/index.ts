import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma/client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STAFF",
        // Never let a person set their own role at signup — an Admin
        // has to promote them from inside the app.
        input: false,
      },
      mosqueId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  // Keeps set-cookie working from server actions/route handlers in the App Router.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
