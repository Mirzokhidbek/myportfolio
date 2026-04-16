import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getEngagement,
  getStats,
  incrementView,
  toggleLike,
} from "@/lib/engagement";
import { getSession } from "@/lib/session";
import { postExists } from "@/lib/blog";

// Posts this browser already viewed today, so refreshing doesn't add views.
const VIEWED_COOKIE = "viewed_posts";
const MAX_VIEWED = 50;

type ActionBody = {
  action?: "view" | "like";
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!(await postExists(slug))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
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
    if (!(await postExists(slug))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }

    if (action !== "view" && action !== "like") {
      return NextResponse.json(
        { ok: false, error: 'Action must be "view" or "like".' },
        { status: 400 }
      );
    }

    if (action === "view") {
      const jar = await cookies();
      const viewed = (jar.get(VIEWED_COOKIE)?.value ?? "").split(",").filter(Boolean);
      const alreadyViewed = viewed.includes(slug);
      const stats = alreadyViewed ? await getStats(slug) : await incrementView(slug);
      const session = await getSession();
      const liked = session ? (await getEngagement(slug, session.sub)).liked : false;

      const res = NextResponse.json({ ok: true, stats, liked });
      if (!alreadyViewed) {
        res.cookies.set(VIEWED_COOKIE, [...viewed, slug].slice(-MAX_VIEWED).join(","), {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }
      return res;
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
