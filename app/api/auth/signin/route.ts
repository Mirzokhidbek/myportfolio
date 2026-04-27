import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { syncAdminRoleFromEnv } from "@/lib/user-role";
import { signAuthToken, AUTH_COOKIE } from "@/lib/auth-token";
import { authCookieOptions } from "@/lib/auth-cookie";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Compared against when the email is unknown, so both cases take about the same time.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

type Body = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`signin:${clientIp(req)}`, 10, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many sign in attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as Body;
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
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
