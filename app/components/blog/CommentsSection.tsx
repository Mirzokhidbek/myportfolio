"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function CommentsSection({ slug }: { slug: string }) {
  const [items, setItems] = useState<CommentItem[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/posts/${slug}/comments`);
    const data = await res.json();
    if (data.ok) setItems(data.comments);
  }, [slug]);

  useEffect(() => {
    loadComments().catch(() => undefined);
  }, [loadComments]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) setUser({ name: data.user.name });
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to post comment.");
        return;
      }
      setMessage("");
      await loadComments();
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 dark:border-white/10 dark:bg-white/5 p-6 md:p-8">
      <h2 className="text-xl font-semibold">Comments</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
        Anyone can read comments. Signing in is required to post.
      </p>

      {user ? (
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <p className="text-xs text-slate-500 dark:text-zinc-500">Posting as {user.name}</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your comment"
            className="w-full min-h-[110px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-zinc-500 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
            required
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:opacity-60 transition"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/20 p-4 text-sm text-slate-600 dark:text-zinc-300">
          <Link
            href={`/auth/signin?next=${encodeURIComponent(`/blog/${slug}`)}`}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            Sign in
          </Link>{" "}
          to join the discussion.
        </div>
      )}

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-zinc-500">No comments yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-2">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
