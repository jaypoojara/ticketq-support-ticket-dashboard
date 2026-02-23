import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const memberToken = request.cookies.get("_ms-mid")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login";

  // Not logged in and trying to access a protected page → send to login
  if (!memberToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in and visiting /login or /signup → send to dashboard
  if (memberToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals, static files, and API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
