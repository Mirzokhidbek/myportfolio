"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-red-600 dark:text-red-300">Error</p>
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Something went wrong</h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
        The page could not be loaded. Try again, or go back to the home page.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-200/80 dark:border-white/15 dark:hover:bg-white/10"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
