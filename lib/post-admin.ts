import fs from "fs/promises";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type CreatePostInput = {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  date?: string;
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
  const cleaned = tags
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return cleaned.length > 0 ? Array.from(new Set(cleaned)) : ["daily", "notes"];
}

function toFrontmatterList(tags: string[]) {
  return tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(", ");
}

export async function createBlogPost(input: CreatePostInput) {
  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();

  if (!title) throw new Error("Title is required.");
  if (!excerpt) throw new Error("Excerpt is required.");
  if (!content) throw new Error("Content is required.");

  const date = normalizeDate(input.date);
  const slug = `${date}-${toSlug(title) || "daily-post"}`;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  const tags = normalizeTags(input.tags);
  const body = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
tags: [${toFrontmatterList(tags)}]
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

${content}
`;

  await fs.mkdir(BLOG_DIR, { recursive: true });

  try {
    await fs.access(filePath);
    throw new Error(`A post with slug "${slug}" already exists.`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }

  await fs.writeFile(filePath, body, "utf8");
  return { slug, filePath };
}

