// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// Paths restricted to TENANT only
const tenantAllowedRoutes = ["/dashboard"];

// Paths restricted to authenticated users
const protectedRoutes = ["/dashboard", "/profile"];

// Public routes (login/register) that should not be accessed by logged-in users
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role; // "USER" | "TENANT"

  // ✅ Redirect unauthenticated users away from protected routes
  if (
    !isAuthenticated &&
    protectedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ✅ Restrict TENANT from accessing routes outside tenantAllowedRoutes
  if (
    isAuthenticated &&
    userRole === "TENANT" &&
    !tenantAllowedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Restrict USER from accessing TENANT routes
  if (
    isAuthenticated &&
    userRole === "USER" &&
    tenantAllowedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Prevent logged-in users from accessing public pages (login/register)
  if (
    isAuthenticated &&
    publicRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(
      new URL(userRole === "TENANT" ? "/dashboard" : "/", request.url)
    );
  }

  // ✅ Allow access if no restrictions matched
  return NextResponse.next();
}

// Apply middleware to all pages except API routes, Next.js internals, and static files
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
