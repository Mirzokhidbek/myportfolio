import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth-token";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("next", "/admin");
    return NextResponse.redirect(url);
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value ?? "";
  const session = token ? await verifyAuthToken(token) : null;

  if (session?.role === "ADMIN") {
    return NextResponse.next();
  }

  if (session) {
    return NextResponse.redirect(new URL("/blog?notice=admin-only", req.url));
  }

  const signin = new URL("/auth/signin", req.url);
  signin.searchParams.set("next", pathname);
  return NextResponse.redirect(signin);
}

export const config = {
  matcher: ["/admin/:path*"],
};
