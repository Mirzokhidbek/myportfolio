import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllPosts } from "@/lib/blog";
import { createPost } from "@/lib/blog-admin";
import { requireAdmin } from "@/lib/session";

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

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as {
      title?: string;
      excerpt?: string;
      content?: string;
      tags?: string[];
      date?: string;
      category?: string;
      coverImage?: string;
    };

    const result = await createPost({
      title: body.title ?? "",
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      tags: body.tags ?? [],
      date: body.date,
      category: body.category,
      coverImage: body.coverImage,
      author: admin.name,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${result.slug}`);

    return NextResponse.json({ ok: true, slug: result.slug, url: `/blog/${result.slug}` });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

