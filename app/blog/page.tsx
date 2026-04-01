import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [posts, session] = await Promise.all([getAllPosts(), getSession()]);
  const isAdmin = session?.role === "ADMIN";

  const pageRaw = typeof searchParams?.page === "string" ? searchParams.page : "1";
  const page = Math.max(1, parseInt(pageRaw, 10) || 1);

  const q =
    typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const tag =
    typeof searchParams?.tag === "string"
      ? searchParams.tag.trim().toLowerCase()
      : "";
  const category =
    typeof searchParams?.category === "string"
      ? searchParams.category.trim().toLowerCase()
      : "";
  const notice =
    typeof searchParams?.notice === "string" ? searchParams.notice : "";

  const filteredAll = posts.filter((p) => {
    const matchesTag = tag ? p.tags.includes(tag) : true;
    const matchesCategory = category ? p.category === category : true;
    if (!matchesTag || !matchesCategory) return false;

    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      p.title.toLowerCase().includes(needle) ||
      p.excerpt.toLowerCase().includes(needle) ||
      p.tags.some((t) => t.toLowerCase().includes(needle))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const filtered = filteredAll.slice(start, start + PAGE_SIZE);

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).sort((a, b) => a.localeCompare(b));
  const allCategories = Array.from(new Set(posts.map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#070a0a] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-6 mb-10">
          {notice === "admin-only" ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              That area is restricted to site administrators.
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Blog
              </h1>
              <p className="text-slate-600 dark:text-zinc-300 mt-2 max-w-xl">
                Daily posts in Markdown. Designed to feel premium and fast.
              </p>
            </div>

            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white transition"
            >
              ← Back to portfolio
            </Link>
          </div>

          {isAdmin ? (
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/20 transition"
              >
                Open Admin Panel
              </Link>
            </div>
          ) : null}

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <form className="flex-1 flex gap-3" method="GET" action="/blog">
              <div className="flex-1">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search posts by title, excerpt, or tags..."
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>
              {tag ? <input type="hidden" name="tag" value={tag} /> : null}
              {category ? <input type="hidden" name="category" value={category} /> : null}
              <button
                type="submit"
                className="px-4 py-3 rounded-2xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  tag === "" && category === ""
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-200/80 dark:hover:bg-white/10"
                }`}
              >
                All
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    tag === t
                      ? "bg-emerald-500 text-black border-emerald-500"
                      : "bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-200/80 dark:hover:bg-white/10"
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  category === c
                    ? "bg-cyan-400 text-black border-cyan-400"
                    : "bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-200/80 dark:hover:bg-white/10"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </header>

        {filteredAll.length === 0 ? (
          <div className="text-slate-600 dark:text-zinc-300 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8">
            No posts found. Try a different search or tag.
          </div>
        ) : (
          <section className="grid md:grid-cols-2 gap-4">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 hover:border-emerald-500/40 transition overflow-hidden relative">
                  <span className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative">
                    {post.coverImage ? (
                      <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-44 w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <h2 className="text-xl font-semibold leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-slate-600 dark:text-zinc-300 text-sm">
                      {post.date} · {post.author} · {post.category} · {post.readingTimeMinutes} min read
                    </p>
                    <p className="mt-4 text-slate-700 dark:text-zinc-200">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {post.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200"
                        >
                          {t}
                        </span>
                      ))}
                      {post.tags.length > 4 ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400">
                          +{post.tags.length - 4}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-emerald-700 group-hover:text-emerald-600 dark:text-emerald-300 dark:group-hover:text-emerald-200 transition">
                        Read post →
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-500">
                        /blog/{post.slug}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}

        {filteredAll.length > 0 && totalPages > 1 ? (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (tag) params.set("tag", tag);
              if (category) params.set("category", category);
              if (p > 1) params.set("page", String(p));
              const href = params.toString() ? `/blog?${params.toString()}` : "/blog";
              const active = p === safePage;
              return (
                <Link
                  key={p}
                  href={href}
                  className={`min-w-[2.5rem] px-3 py-2 rounded-xl text-sm border transition ${
                    active
                      ? "bg-emerald-500 text-black border-emerald-500"
                      : "bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-200/80 dark:hover:bg-white/10"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </main>
  );
}
