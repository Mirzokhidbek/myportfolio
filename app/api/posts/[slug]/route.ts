import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPostBySlug } from "@/lib/blog";
import { deletePost, updatePost } from "@/lib/blog-admin";
import { requireAdmin } from "@/lib/session";

type UpdateRequest = {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  date?: string;
  category?: string;
  coverImage?: string;
};

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const { slug } = await context.params;
    const body = (await req.json()) as UpdateRequest;
    await updatePost(slug, { ...body, author: admin.name });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const { slug } = await context.params;
    await deletePost(slug);

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

