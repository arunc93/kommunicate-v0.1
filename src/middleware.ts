import { NextResponse, type NextRequest } from "next/server";
import {
  STUB_ROLE_COOKIE,
  canAccess,
  homeForRole,
  isSupabaseConfigured,
  parseRole,
} from "@/features/auth/access";

export function middleware(request: NextRequest) {
  if (isSupabaseConfigured()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const role = parseRole(request.cookies.get(STUB_ROLE_COOKIE)?.value);

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = role ? homeForRole(role) : "/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login") return NextResponse.next();

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!canAccess(role, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole(role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
