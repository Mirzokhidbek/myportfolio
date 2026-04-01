import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllPosts, getPostBySlug, extractHeadings } from "@/lib/blog";
import ReadingProgress from "@/app/components/blog/ReadingProgress";
import MarkdownContent from "@/app/components/blog/MarkdownContent";
import PostInteractions from "@/app/components/blog/PostInteractions";
import CommentsSection from "@/app/components/blog/CommentsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Post not found | Blog" };
  }
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const allPosts = await getAllPosts();
  const recent = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const headings = extractHeadings(post.content);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#070a0a] dark:to-black dark:text-white px-6 py-10">
      <ReadingProgress />

      <div id="top" className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="text-slate-600 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white transition text-sm"
          >
            ← Back to Blog
          </Link>
          <Link
            href="#top"
            className="text-slate-500 hover:text-emerald-700 dark:text-zinc-500 dark:hover:text-emerald-300 transition text-sm"
          >
            Top ↑
          </Link>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <article className="min-w-0">
            <header>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {post.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-zinc-300">
                <span>{post.date}</span>
                <span className="opacity-40">·</span>
                <span>By {post.author}</span>
                <span className="opacity-40">·</span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>

              {post.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-800 dark:hover:text-emerald-200 transition"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="mt-8 rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-8">
              {post.coverImage ? (
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full max-h-[420px] object-cover"
                  />
                </div>
              ) : null}
              <MarkdownContent content={post.content} />
            </div>

            <div className="mt-6">
              <PostInteractions slug={post.slug} title={post.title} />
            </div>

            <div className="mt-6">
              <CommentsSection slug={post.slug} />
            </div>

            {recent.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-xl font-semibold">More posts</h2>
                <div className="mt-5 flex flex-col gap-3">
                  {recent.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="p-4 rounded-2xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:bg-slate-200/80 dark:hover:bg-white/10 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-zinc-100">
                            {p.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                            {p.date} · {p.readingTimeMinutes} min read
                          </div>
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300 shrink-0">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="lg:sticky top-8 h-fit space-y-6">
            <section className="rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Table of contents
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                Jump to sections in this post.
              </p>

              {headings.length === 0 ? (
                <div className="mt-4 text-sm text-slate-500 dark:text-zinc-500">
                  No headings found (use `##`, `###`, `####`).
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {headings.map((h, idx) => (
                    <li key={`${h.id}-${idx}`}>
                      <a
                        href={`#${h.id}`}
                        className={[
                          "block text-sm leading-tight text-slate-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-200 transition",
                          h.level === 2
                            ? "ml-0"
                            : h.level === 3
                              ? "ml-3"
                              : "ml-6",
                        ].join(" ")}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Recent posts
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {recent.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-zinc-500">No posts yet.</div>
                ) : (
                  recent.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="text-sm text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate">
                          {p.title}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-500 shrink-0">
                          {p.readingTimeMinutes}m
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

