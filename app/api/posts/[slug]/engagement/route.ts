import { NextResponse } from "next/server";
import {
  getEngagement,
  incrementView,
  toggleLike,
} from "@/lib/engagement";
import { getSession } from "@/lib/session";

type ActionBody = {
  action?: "view" | "like";
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const session = await getSession();
    const { stats, liked } = await getEngagement(slug, session?.sub);
    return NextResponse.json({ ok: true, stats, liked });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load stats.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const body = (await req.json()) as ActionBody;
    const { slug } = await context.params;
    const action = body.action ?? "view";

    if (action === "view") {
      const stats = await incrementView(slug);
      const session = await getSession();
      const liked = session ? (await getEngagement(slug, session.sub)).liked : false;
      return NextResponse.json({ ok: true, stats, liked });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in to like posts." },
        { status: 401 }
      );
    }

    const { liked, stats } = await toggleLike(slug, session.sub);
    return NextResponse.json({ ok: true, stats, liked });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update stats.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
