import { prisma } from "@/lib/prisma";

export const MAX_COMMENT_LENGTH = 1000;

export type PublicComment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  canDelete: boolean;
};

type Viewer = { sub: string; role: "ADMIN" | "USER" } | null;

export async function getComments(slug: string, viewer: Viewer = null): Promise<PublicComment[]> {
  const rows = await prisma.comment.findMany({
    where: { postSlug: slug },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true } } },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.user.name,
    message: c.message,
    createdAt: c.createdAt.toISOString(),
    canDelete: Boolean(viewer && (viewer.role === "ADMIN" || viewer.sub === c.userId)),
  }));
}

/** Authors can delete their own comments; admins can delete any. Returns false if not allowed or missing. */
export async function deleteComment(slug: string, commentId: string, viewer: NonNullable<Viewer>) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.postSlug !== slug) return false;
  if (viewer.role !== "ADMIN" && comment.userId !== viewer.sub) return false;
  await prisma.comment.delete({ where: { id: commentId } });
  return true;
}

export async function addComment(slug: string, userId: string, message: string) {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    throw new Error("Comment is required.");
  }
  if (cleanMessage.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be ${MAX_COMMENT_LENGTH} characters or less.`);
  }

  return prisma.comment.create({
    data: {
      postSlug: slug,
      userId,
      message: cleanMessage,
    },
    include: { user: { select: { name: true } } },
  });
}

export async function getStats(slug: string) {
  const [stat, likes] = await Promise.all([
    prisma.postStat.findUnique({ where: { postSlug: slug } }),
    prisma.like.count({ where: { postSlug: slug } }),
  ]);
  return {
    views: stat?.views ?? 0,
    likes,
  };
}

export async function incrementView(slug: string) {
  await prisma.postStat.upsert({
    where: { postSlug: slug },
    create: { postSlug: slug, views: 1 },
    update: { views: { increment: 1 } },
  });
  return getStats(slug);
}

export async function hasUserLiked(slug: string, userId: string) {
  const row = await prisma.like.findUnique({
    where: {
      postSlug_userId: { postSlug: slug, userId },
    },
  });
  return Boolean(row);
}

export async function toggleLike(slug: string, userId: string) {
  const existing = await prisma.like.findUnique({
    where: {
      postSlug_userId: { postSlug: slug, userId },
    },
  });

  // Fast double clicks can race; treat "already liked" / "already removed" as success.
  if (existing) {
    await prisma.like.deleteMany({ where: { postSlug: slug, userId } });
  } else {
    try {
      await prisma.like.create({
        data: { postSlug: slug, userId },
      });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code !== "P2002") throw error;
    }
  }

  const liked = !existing;
  const stats = await getStats(slug);
  return { liked, stats };
}

export async function getEngagement(slug: string, userId?: string) {
  const stats = await getStats(slug);
  const liked = userId ? await hasUserLiked(slug, userId) : false;
  return { stats, liked };
}
