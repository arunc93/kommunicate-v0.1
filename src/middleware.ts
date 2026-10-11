import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  STUB_ROLE_COOKIE,
  canAccess,
  homeForRole,
  isSupabaseAuthEnabled,
  parseRole,
} from "@/features/auth/access";

function stubMiddleware(request: NextRequest) {
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

function withSession(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}

export async function middleware(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) return stubMiddleware(request);

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  const { pathname } = request.nextUrl;

  const redirectTo = (pathname: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search;
    return withSession(supabaseResponse, NextResponse.redirect(url));
  };

  if (!userId) {
    if (pathname === "/login") return supabaseResponse;
    return redirectTo("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  const role = parseRole(profile && typeof profile.role === "string" ? profile.role : null);

  if (!role) {
    await supabase.auth.signOut();
    if (pathname === "/login") return supabaseResponse;
    return redirectTo("/login", "?notice=no-role");
  }

  if (pathname === "/" || pathname === "/login") return redirectTo(homeForRole(role));
  if (!canAccess(role, pathname)) return redirectTo(homeForRole(role));
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
