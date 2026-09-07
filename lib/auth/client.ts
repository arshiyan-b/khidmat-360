import { createAuthClient } from "better-auth/react";

// Always talk to whatever origin the page is actually loaded from —
// avoids cross-origin/CORS issues entirely if the app is opened via
// localhost, 127.0.0.1, or a LAN IP during local development.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000");

export const authClient = createAuthClient({ baseURL });

export const { signIn, signOut, useSession } = authClient;
