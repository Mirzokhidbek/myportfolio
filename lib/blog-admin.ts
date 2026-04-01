import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function isEnoent(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT";
}

export type AdminPostInput = {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  date?: string;
  category?: string;
  coverImage?: string;
  author?: string;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeDate(date?: string) {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeTags(tags?: string[]) {
  if (!tags || tags.length === 0) return ["daily", "notes"];
  const cleaned = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  return cleaned.length ? Array.from(new Set(cleaned)) : ["daily", "notes"];
}

function normalizeCategory(category?: string) {
  return (category ?? "general").trim().toLowerCase() || "general";
}

function toFrontmatterList(tags: string[]) {
  return tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(", ");
}

function buildMarkdown(
  input: Required<Omit<AdminPostInput, "date" | "author">> & { date: string; author: string }
) {
  return `---
title: "${input.title.replace(/"/g, '\\"')}"
author: "${input.author.replace(/"/g, '\\"')}"
date: "${input.date}"
category: "${input.category.replace(/"/g, '\\"')}"
tags: [${toFrontmatterList(input.tags)}]
coverImage: "${input.coverImage.replace(/"/g, '\\"')}"
excerpt: "${input.excerpt.replace(/"/g, '\\"')}"
---

${input.content}
`;
}

async function ensureDir() {
  await fs.mkdir(BLOG_DIR, { recursive: true });
}

export async function createPost(input: AdminPostInput) {
  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();
  if (!title || !excerpt || !content) throw new Error("Title, excerpt and content are required.");

  const date = normalizeDate(input.date);
  const slug = `${date}-${toSlug(title) || "daily-post"}`;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const tags = normalizeTags(input.tags);
  const category = normalizeCategory(input.category);
  const coverImage = (input.coverImage ?? "").trim();
  const author = (input.author ?? "Author").trim() || "Author";

  await ensureDir();
  try {
    await fs.access(filePath);
    throw new Error(`A post with slug "${slug}" already exists.`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  const body = buildMarkdown({ title, excerpt, content, tags, category, coverImage, date, author });
  await fs.writeFile(filePath, body, "utf8");
  return { slug, filePath };
}

export async function updatePost(slug: string, input: Partial<AdminPostInput>) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (e) {
    if (isEnoent(e)) {
      throw new Error(
        `Post "${slug}" has no file on disk (expected ${filePath}). It may have been deleted outside the admin.`
      );
    }
    throw e;
  }
  const parsed = matter(raw);

  const nextTitle = String(input.title ?? parsed.data.title ?? slug).trim();
  const nextExcerpt = String(input.excerpt ?? parsed.data.excerpt ?? "").trim();
  const nextContent = String(input.content ?? parsed.content ?? "").trim();
  const nextDate = normalizeDate(String(input.date ?? parsed.data.date ?? ""));
  const nextCategory = normalizeCategory(String(input.category ?? parsed.data.category ?? "general"));
  const nextCoverImage = String(input.coverImage ?? parsed.data.coverImage ?? "").trim();
  const nextAuthor = String(input.author ?? parsed.data.author ?? "Author").trim() || "Author";
  const nextTags = normalizeTags(
    Array.isArray(input.tags)
      ? input.tags
      : Array.isArray(parsed.data.tags)
        ? parsed.data.tags.map((t: unknown) => String(t))
        : []
  );

  if (!nextTitle || !nextExcerpt || !nextContent) {
    throw new Error("Title, excerpt and content are required.");
  }

  const body = buildMarkdown({
    title: nextTitle,
    excerpt: nextExcerpt,
    content: nextContent,
    date: nextDate,
    category: nextCategory,
    coverImage: nextCoverImage,
    tags: nextTags,
    author: nextAuthor,
  });
  await fs.writeFile(filePath, body, "utf8");
}

export async function deletePost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    await fs.unlink(filePath);
  } catch (e) {
    if (!isEnoent(e)) throw e;
  }
}

export async function getPostRawBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (e) {
    if (isEnoent(e)) return null;
    throw e;
  }
  const parsed = matter(raw);

  return {
    slug,
    title: String(parsed.data.title ?? slug),
    excerpt: String(parsed.data.excerpt ?? ""),
    content: parsed.content,
    date: String(parsed.data.date ?? ""),
    category: String(parsed.data.category ?? "general"),
    coverImage: String(parsed.data.coverImage ?? ""),
    author: String(parsed.data.author ?? ""),
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map((t: unknown) => String(t)) : [],
  };
}

