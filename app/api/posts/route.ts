import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

// Writes go through /api/admin/posts.
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ ok: true, posts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load posts.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
