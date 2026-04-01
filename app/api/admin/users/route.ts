import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." }, 
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load users.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
