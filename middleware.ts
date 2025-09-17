import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {jwtDecode} from "jwt-decode";

interface IJwtPayload {
  exp: number;      // Expiration time (Unix timestamp)
  iat: number;      // Issued at time (Unix timestamp)
  roleId: number;   // Role ID of the user
  tenantId: number; // Tenant ID (e.g. for multi-tenant systems)
  type: string;     // Token type, e.g., "access"
  userId: number;   // User ID
}



export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/users", "/tenants", "/settings"]
  const authRoutes = ["/login", "/signup", "/verify-2fa", "/setup-2fa"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get authentication token from cookies or headers
  const authToken = request.cookies.get("access_token")?.value || request.headers.get("authorization")

  // If accessing a protected route without authentication
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // if(authToken) {
  //   let decodedToken = jwtDecode<IJwtPayload>(authToken);
  //   console.log("Decode Token:",decodedToken)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
