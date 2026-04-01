import { prisma } from "@/lib/prisma";

export type PublicComment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export async function getComments(slug: string): Promise<PublicComment[]> {
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
  }));
}

export async function addComment(slug: string, userId: string, message: string) {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    throw new Error("Comment is required.");
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
  const stat = await prisma.postStat.findUnique({ where: { postSlug: slug } });
  const likes = await prisma.like.count({ where: { postSlug: slug } });
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

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { postSlug: slug, userId },
    });
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
