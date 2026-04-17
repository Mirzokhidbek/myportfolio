import { NextResponse } from "next/server";
import { addComment, deleteComment, getComments } from "@/lib/engagement";
import { getSession } from "@/lib/session";
import { postExists } from "@/lib/blog";

type CreateBody = {
  message?: string;
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
    const comments = await getComments(slug, await getSession());
    return NextResponse.json({ ok: true, comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load comments.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in to comment." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as CreateBody;
    const { slug } = await context.params;
    if (!(await postExists(slug))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
    const row = await addComment(slug, session.sub, String(body.message ?? ""));
    const comment = {
      id: row.id,
      name: row.user.name,
      message: row.message,
      createdAt: row.createdAt.toISOString(),
      canDelete: true,
    };
    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add comment.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: "You must be signed in." }, { status: 401 });
    }

    const { slug } = await context.params;
    const id = new URL(req.url).searchParams.get("id") ?? "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "Comment id is required." }, { status: 400 });
    }

    const deleted = await deleteComment(slug, id, session);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Comment not found or not yours." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete comment.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
