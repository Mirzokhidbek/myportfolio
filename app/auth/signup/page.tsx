"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }
      router.push("/blog");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#050809] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-md mx-auto rounded-3xl border border-slate-200 bg-white/90 dark:border-white/10 dark:bg-white/5 p-6 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-2 text-sm">
          Use a strong password. The email in your server{" "}
          <code className="text-slate-800 dark:text-zinc-200">ADMIN_EMAIL</code> becomes an admin automatically.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-600 dark:text-zinc-300">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
              autoComplete="name"
              required
            />
          </label>

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
            <span className="text-sm text-slate-600 dark:text-zinc-300">Password (8+ characters)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
              autoComplete="new-password"
              required
              minLength={8}
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
            {submitting ? "Creating…" : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200">
            Sign in
          </Link>
        </p>

        <div className="mt-4 text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200">
            ← Home
          </Link>
        </div>
      </div>
    </main>
  );
}
