import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export type BlogTag = string;

export type BlogPostListItem = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD (recommended)
  author: string;
  tags: BlogTag[];
  category: string;
  coverImage: string;
  excerpt: string;
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostListItem & {
  content: string;
  filePath: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Slugs are file names in content/blog, so only allow safe characters (no "/" or ".."). */
export function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug);
}

function estimateReadingTimeMinutes(markdown: string) {
  // Rough estimate: 200 words/min
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function extractHeadings(markdown: string) {
  // TOC extraction: supports ## / ### / #### headings (Markdown syntax).
  // We generate ids using the same slug algorithm as rehype-slug (github-slugger).
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");

  const headings: Array<{
    id: string;
    text: string;
    level: 2 | 3 | 4;
  }> = [];

  for (const line of lines) {
    const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const hashes = match[1];
    const level = hashes.length as 2 | 3 | 4;
    const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();

    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}

function parsePost(slug: string, raw: string, excerptLength: number) {
  const parsed = matter(raw);

  const title = String(parsed.data.title ?? slug);
  const date = String(parsed.data.date ?? "1970-01-01");
  const author = String(parsed.data.author ?? "").trim() || "Editor";
  const tags = Array.isArray(parsed.data.tags)
    ? parsed.data.tags.map((t) => normalizeTag(String(t)))
    : [];
  const category = String(parsed.data.category ?? "general").trim().toLowerCase();
  const coverImage = String(parsed.data.coverImage ?? "").trim();
  const excerpt =
    String(parsed.data.excerpt ?? "").trim() ||
    String(parsed.content.trim().slice(0, excerptLength));

  const item: BlogPostListItem = {
    slug,
    title,
    date,
    author,
    tags,
    category,
    coverImage,
    excerpt,
    readingTimeMinutes: estimateReadingTimeMinutes(parsed.content),
  };
  return { item, content: parsed.content };
}

export async function getAllPosts(): Promise<BlogPostListItem[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_"))
    .map((e) => e.name);

  const posts: BlogPostListItem[] = [];

  for (const fileName of mdFiles) {
    const slug = fileName.replace(/\.md$/, "");
    const raw = await fs.readFile(path.join(BLOG_DIR, fileName), "utf8");
    posts.push(parsePost(slug, raw, 140).item);
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { item, content } = parsePost(slug, raw, 160);
    return { ...item, content, filePath };
  } catch {
    return null;
  }
}
