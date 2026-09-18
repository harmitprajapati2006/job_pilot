import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/find-jobs"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Let static assets and internal endpoints pass directly
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return response;
  }

  try {
    const sessionResult = await updateSession({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    const isAuthenticated = Boolean(sessionResult.accessToken);

    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Unauthenticated user trying to access protected route
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated user trying to access login page
    if (pathname === "/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("[middleware] session error:", error);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
  ],
};
