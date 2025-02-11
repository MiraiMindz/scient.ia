// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/public/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Get the JWT from the cookies.
  const token = request.cookies.get("token")?.value;
  if (!token) {
    // If no token, redirect to login page.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/";
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.SCIENTIAPRIVATERSAKEY!);
    const { payload } = await jwtVerify(token, secret);

    const userRole = payload.role as string;

    if (pathname.startsWith("/app") && !["admin", "instructor", "student", "user"].includes(userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // // Add further role checks as necessary.
    // // For example, you might allow only "instructor" and "admin" roles for "/dashboard/instructor"
    // if (pathname.startsWith("/dashboard/instructor") && !["admin", "instructor"].includes(userRole)) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/";
    //   return NextResponse.redirect(url);
    // }

    // If everything is okay, allow the request.
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}
