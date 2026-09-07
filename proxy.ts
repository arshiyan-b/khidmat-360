import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This is an optimistic check on the session cookie only — it keeps
// signed-out visitors from ever loading a protected page, but it does
// NOT verify the session or the user's role. Every protected page must
// still call auth.api.getSession() itself before showing anything.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/donations/:path*",
    "/expenses/:path*",
    "/events/:path*",
    "/profile/:path*",
    "/setup/:path*",
  ],
};
