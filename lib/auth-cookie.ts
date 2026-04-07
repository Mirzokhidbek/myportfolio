import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { AUTH_COOKIE } from "@/lib/auth-token";

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

/** Response that clears the session cookie (and the legacy admin cookie). */
export function logoutResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", clearAuthCookieOptions());
  res.cookies.set(ADMIN_SESSION_COOKIE, "", clearAuthCookieOptions());
  return res;
}
