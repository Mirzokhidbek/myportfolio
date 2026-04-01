import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { roleForNewUser } from "@/lib/user-role";
import { signAuthToken, AUTH_COOKIE } from "@/lib/auth-token";
import { authCookieOptions } from "@/lib/auth-cookie";

type Body = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = roleForNewUser(email);

    const user = await prisma.user.create({
      data: { email, passwordHash, name, role },
    });

    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role === "ADMIN" ? "ADMIN" : "USER",
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return res;
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? String((e as { code: string }).code) : "";
    if (code === "P2002") {
      return NextResponse.json({ ok: false, error: "An account with this email already exists." }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : "Sign up failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
