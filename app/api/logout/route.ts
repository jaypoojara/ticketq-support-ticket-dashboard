import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url);

  // Clear the Memberstack session cookie so middleware lets the user through to /login
  response.cookies.set("_ms-mid", "", { maxAge: 0, path: "/" });

  return response;
}
