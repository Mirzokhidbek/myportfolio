"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export default function GlobalSiteControls() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && data.user) setUser(data.user);
      else setUser(null);
      if (data.ok && data.sessionRefreshed) {
        router.refresh();
      }
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] border-b border-black/10 bg-background/85 backdrop-blur-md dark:border-white/10"
      role="banner"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:px-6 sm:gap-4">
        <nav className="flex min-w-0 flex-1 items-center gap-1 text-xs sm:text-sm" aria-label="Primary">
          <Link
            href="/"
            className="shrink-0 rounded-lg px-2 py-1.5 font-medium text-foreground/90 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:hover:bg-white/10"
          >
            Portfolio
          </Link>
          <Link
            href="/blog"
            className="shrink-0 rounded-lg px-2 py-1.5 text-foreground/80 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:hover:bg-white/10"
          >
            Blog
          </Link>
        </nav>

        <div
          className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          aria-busy={!ready}
        >
          {!ready ? (
            <div
              className="h-8 w-[7.5rem] rounded-lg bg-foreground/5 animate-pulse"
              aria-hidden
            />
          ) : user ? (
            <>
              <span
                className="hidden max-w-[100px] truncate text-xs text-foreground/80 sm:inline md:max-w-[140px]"
                title={user.email}
              >
                {user.name}
              </span>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => logout()}
                disabled={loggingOut}
                className="rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                {loggingOut ? "…" : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg px-2 py-1.5 text-xs text-foreground/90 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-emerald-600/15 px-2 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-600/25 dark:text-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
