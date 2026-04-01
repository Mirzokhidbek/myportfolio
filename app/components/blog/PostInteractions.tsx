"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = { views: number; likes: number };

export default function PostInteractions({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [stats, setStats] = useState<Stats>({ views: 0, likes: 0 });
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [likeError, setLikeError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/blog/${slug}`);
    }

    let cancelled = false;
    const load = async () => {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const me = await meRes.json();
      if (!cancelled && me.ok && me.user) setUserId(me.user.id);

      const res = await fetch(`/api/posts/${slug}/engagement`, { cache: "no-store" });
      const data = await res.json();
      if (!cancelled && data.ok) {
        setStats(data.stats);
        setLiked(Boolean(data.liked));
      }
    };

    load().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    fetch(`/api/posts/${slug}/engagement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStats(data.stats);
          if (typeof data.liked === "boolean") setLiked(data.liked);
        }
      })
      .catch(() => undefined);
  }, [slug]);

  async function onLike() {
    setLikeError("");
    const res = await fetch(`/api/posts/${slug}/engagement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setLikeError(data.error ?? "Could not update like.");
      return;
    }
    setStats(data.stats);
    setLiked(Boolean(data.liked));
  }

  async function onShareNative() {
    if (!canShare || !shareUrl) return;

    try {
      await navigator.share({ title, url: shareUrl });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Share failed", error);
    }
  }

  function onShareTelegram() {
    if (!shareUrl) return;

    const url =
      "https://t.me/share/url?url=" +
      encodeURIComponent(shareUrl) +
      "&text=" +
      encodeURIComponent(title);

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  async function onCopyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 dark:border-white/10 dark:bg-white/5 p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600 dark:text-zinc-300">
        <span className="mr-4">{stats.views} views</span>
        <span>{stats.likes} likes</span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {likeError ? (
          <p className="text-xs text-red-300 sm:order-last sm:w-full">{likeError}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {userId ? (
            <button
              type="button"
              onClick={() => onLike()}
              className={`px-3 py-2 rounded-xl border text-sm transition ${
                liked
                  ? "border-rose-400/50 bg-rose-500/20 text-rose-900 dark:text-rose-100"
                  : "border-slate-300 hover:bg-slate-200/80 dark:border-white/15 dark:hover:bg-white/10"
              }`}
            >
              {liked ? "Unlike" : "Like"}
            </button>
          ) : (
            <Link
              href={`/auth/signin?next=${encodeURIComponent(`/blog/${slug}`)}`}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-200/80 dark:border-white/15 dark:hover:bg-white/10 text-sm transition"
            >
              Sign in to like
            </Link>
          )}
          {mounted ? (
            <>
              <button
                type="button"
                onClick={() => onCopyLink()}
                className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-200/80 dark:border-white/15 dark:hover:bg-white/10 text-sm transition"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => onShareTelegram()}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-[#0088cc] text-white text-sm font-medium hover:bg-[#007ab8] transition"
              >
                Telegram
              </button>
              {canShare ? (
                <button
                  type="button"
                  onClick={() => onShareNative()}
                  className="px-3 py-2 rounded-xl bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 transition"
                >
                  Share
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
