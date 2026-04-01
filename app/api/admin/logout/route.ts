import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth-token";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { clearAuthCookieOptions } from "@/lib/auth-cookie";

/** Clears session cookies; same effect as POST /api/auth/logout. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", clearAuthCookieOptions());
  res.cookies.set(ADMIN_SESSION_COOKIE, "", clearAuthCookieOptions());
  return res;
}
