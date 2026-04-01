"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/blog";
  const nextPath =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/blog";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/blog");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-slate-600 dark:text-zinc-300 mt-2 text-sm">
        Comment on posts and like articles. Admins use the same account to manage the blog.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-zinc-300">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600 dark:text-zinc-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-black font-medium hover:bg-emerald-400 disabled:opacity-60 transition"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500 dark:text-zinc-400">
        No account?{" "}
        <Link href="/auth/signup" className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200">
          Create one
        </Link>
      </p>

      <div className="mt-4 text-sm">
        <Link href="/blog" className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          ← Blog
        </Link>
      </div>
    </>
  );
}
