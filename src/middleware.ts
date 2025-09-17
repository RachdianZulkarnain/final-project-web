import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

const tenantAllowedRoutes = ["/dashboard"];

const protectedRoutes = ["/dashboard", "/profile"];

const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  if (
    !isAuthenticated &&
    protectedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    isAuthenticated &&
    userRole === "TENANT" &&
    !tenantAllowedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    isAuthenticated &&
    userRole === "USER" &&
    tenantAllowedRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    isAuthenticated &&
    publicRoutes.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(
      new URL(userRole === "TENANT" ? "/dashboard" : "/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
