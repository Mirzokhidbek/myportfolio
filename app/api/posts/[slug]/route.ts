import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog";

// Writes go through /api/admin/posts/[slug].
export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
