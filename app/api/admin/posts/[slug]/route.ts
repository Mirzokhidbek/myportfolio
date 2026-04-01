import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePost, getPostRawBySlug, updatePost } from "@/lib/blog-admin";
import { requireAdmin } from "@/lib/session";

type UpdateRequest = {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  date?: string;
  category?: string;
  coverImage?: string;
  author?: string;
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const { slug } = await context.params;
    const post = await getPostRawBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Post file not found. It may have been removed from content/blog/." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();
    const { slug } = await context.params;
    const body = (await req.json()) as UpdateRequest;
    await updatePost(slug, { ...body, author: admin.name });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!(await requireAdmin())) return unauthorized();
    const { slug } = await context.params;
    await deletePost(slug);

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

