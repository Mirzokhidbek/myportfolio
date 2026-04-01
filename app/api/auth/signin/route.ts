import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { syncAdminRoleFromEnv } from "@/lib/user-role";
import { signAuthToken, AUTH_COOKIE } from "@/lib/auth-token";
import { authCookieOptions } from "@/lib/auth-cookie";

type Body = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const synced = await syncAdminRoleFromEnv(user);
    const role = synced.role === "ADMIN" ? "ADMIN" : "USER";

    const token = await signAuthToken({
      sub: synced.id,
      email: synced.email,
      name: synced.name,
      role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: synced.id,
        email: synced.email,
        name: synced.name,
        role: synced.role,
      },
    });
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sign in failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
