import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">404</p>
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or was moved.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-200/80 dark:border-white/15 dark:hover:bg-white/10"
        >
          Read the blog
        </Link>
      </div>
    </main>
  );
}
