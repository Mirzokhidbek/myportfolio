import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { syncAdminRoleFromEnv } from "@/lib/user-role";
import { signAuthToken, AUTH_COOKIE } from "@/lib/auth-token";
import { authCookieOptions } from "@/lib/auth-cookie";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: true, user: null, sessionRefreshed: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ ok: true, user: null, sessionRefreshed: false });
  }

  const synced = await syncAdminRoleFromEnv(user);
  const jwtRole = synced.role === "ADMIN" ? "ADMIN" : "USER";
  const needsNewCookie = session.role !== jwtRole;

  const res = NextResponse.json({
    ok: true,
    user: {
      id: synced.id,
      email: synced.email,
      name: synced.name,
      role: synced.role,
    },
    sessionRefreshed: needsNewCookie,
  });

  if (needsNewCookie) {
    const token = await signAuthToken({
      sub: synced.id,
      email: synced.email,
      name: synced.name,
      role: jwtRole,
    });
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  }

  return res;
}
