"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

type ApiSuccess = { ok: true; slug: string; url: string };
type ApiFailure = { ok: false; error: string };
type AdminPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: string;
  coverImage: string;
};

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [editFromQuery, setEditFromQuery] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("daily, notes");
  const [category, setCategory] = useState("general");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverLocalPreview, setCoverLocalPreview] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("## Today\n\nWrite your daily update here.");
  const [inlineFile, setInlineFile] = useState<File | null>(null);
  const [inlineAltText, setInlineAltText] = useState("image");
  const [inlineUploading, setInlineUploading] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState("");
  const [inlineLocalPreview, setInlineLocalPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editorColorMode, setEditorColorMode] = useState<"light" | "dark">("dark");

  const normalizedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags]
  );

  useEffect(() => {
    return () => {
      if (coverLocalPreview) URL.revokeObjectURL(coverLocalPreview);
    };
  }, [coverLocalPreview]);

  useEffect(() => {
    return () => {
      if (inlineLocalPreview) URL.revokeObjectURL(inlineLocalPreview);
    };
  }, [inlineLocalPreview]);

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.dataset.theme;
      setEditorColorMode(t === "light" ? "light" : "dark");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setCreatedUrl("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date: date || undefined,
          tags: normalizedTags,
          category,
          coverImage,
          excerpt,
          content,
        }),
      });

      const data = (await res.json()) as ApiSuccess | ApiFailure;
      if (!res.ok || !data.ok) {
        setError(data.ok ? "Failed to create post." : data.error);
        return;
      }

      setCreatedUrl(data.url);
      setTitle("");
      setExcerpt("");
      setCategory("general");
      setCoverImage("");
      setCoverFile(null);
      setCoverLocalPreview(null);
      setInlineFile(null);
      setInlineLocalPreview(null);
      setInlineImageUrl("");
      setContent("## Today\n\nWrite your daily update here.");
      await loadPosts();
    } catch {
      setError("Something went wrong while creating the post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/signin?next=/admin");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPosts(data.posts);
      }
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUsersError(data.error ?? "Failed to load users.");
        return;
      }
      setUsers(data.users ?? []);
    } catch {
      setUsersError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  async function startEdit(slug: string) {
    const res = await fetch(`/api/admin/posts/${slug}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load post.");
      return;
    }
    const post = data.post as AdminPost & { content: string };
    setEditingSlug(slug);
    setTitle(post.title);
    setDate(post.date);
    setTags(post.tags.join(", "));
    setCategory(post.category || "general");
    setCoverImage(post.coverImage || "");
    setCoverFile(null);
    setCoverLocalPreview(null);
    setCoverUploading(false);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setInlineFile(null);
    setInlineImageUrl("");
    setInlineUploading(false);
  }

  async function saveEdit() {
    if (!editingSlug) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${editingSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          tags: normalizedTags,
          category,
          coverImage,
          excerpt,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to update.");
        return;
      }
      setEditingSlug(null);
      setCreatedUrl(`/blog/${editingSlug}`);
      await loadPosts();
    } catch {
      setError("Failed to update post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(slug: string) {
    if (!confirm(`Delete post "${slug}"?`)) return;
    const res = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to delete.");
      return;
    }
    await loadPosts();
  }

  async function uploadImageToCloudinary(file: File, folder: string) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/uploads/image", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
    if (!res.ok || !data.ok || !data.url) {
      throw new Error(data.error ?? "Upload failed.");
    }
    return data.url;
  }

  async function onUploadCoverImage() {
    if (!coverFile) return;
    setError("");
    setCoverUploading(true);
    try {
      const url = await uploadImageToCloudinary(coverFile, "blog/covers");
      setCoverImage(url);
      setCoverFile(null);
      setCoverLocalPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload cover image.");
    } finally {
      setCoverUploading(false);
    }
  }

  function insertInlineImageMarkdown(url: string) {
    const alt = inlineAltText.trim() || "image";
    setContent((prev) => `${prev}\n\n![${alt}](${url})\n`);
  }

  async function onUploadAndInsertInlineImage() {
    if (!inlineFile) return;
    setError("");
    setInlineUploading(true);
    try {
      const url = await uploadImageToCloudinary(inlineFile, "blog/inline");
      insertInlineImageMarkdown(url);
      setInlineFile(null);
      setInlineLocalPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload inline image.");
    } finally {
      setInlineUploading(false);
    }
  }

  function onInsertInlineImageUrl() {
    const url = inlineImageUrl.trim();
    if (!url) return;
    insertInlineImageMarkdown(url);
    setInlineImageUrl("");
  }

  function clearForm() {
    setEditingSlug(null);
    setTitle("");
    setDate("");
    setTags("daily, notes");
    setCategory("general");
    setCoverImage("");
    setCoverFile(null);
    setCoverLocalPreview(null);
    setCoverUploading(false);
    setExcerpt("");
    setContent("## Today\n\nWrite your daily update here.");
    setCreatedUrl("");
    setInlineFile(null);
    setInlineLocalPreview(null);
    setInlineImageUrl("");
    setInlineUploading(false);
    setError("");
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setEditFromQuery(params.get("edit"));
  }, []);

  useEffect(() => {
    loadPosts().catch(() => undefined);
    loadUsers().catch(() => undefined);
  }, [loadPosts, loadUsers]);

  useEffect(() => {
    if (!editFromQuery) return;
    startEdit(editFromQuery).catch(() => undefined);
  }, [editFromQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#050809] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Blog Admin Panel
            </h1>
            <p className="text-slate-600 dark:text-zinc-300 mt-2">
              Create, edit, and delete blog posts. Changes appear on{" "}
              <code className="text-slate-800 dark:text-zinc-200">/blog</code>.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/blog" className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200">
              Open blog →
            </Link>
            <Link href="/" className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200">
              Back home
            </Link>
            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="text-left text-red-300 hover:text-red-200 disabled:opacity-60 transition"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-white/5 p-6 md:p-8 space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingSlug ? `Editing: ${editingSlug}` : "Create New Post"}
            </h2>
            {editingSlug ? (
              <button
                type="button"
                onClick={clearForm}
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition"
              >
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-zinc-300">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="My Daily Update"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600 dark:text-zinc-300">Date (optional)</span>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="YYYY-MM-DD"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600 dark:text-zinc-300">Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="frontend"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-slate-600 dark:text-zinc-300">Tags (comma separated)</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="daily, notes, nextjs"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 dark:text-zinc-300">Excerpt</span>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Short summary shown on blog cards."
              required
            />
          </label>

          <div className="space-y-3 md:col-span-2">
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-zinc-300">Cover image upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCoverFile(file);
                  setCoverLocalPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="mt-2 w-full text-sm text-slate-600 dark:text-zinc-300 file:mr-4 file:rounded-full file:border file:border-slate-300 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-800 file:hover:bg-slate-200 dark:file:border-white/10 dark:file:bg-black/30 dark:file:text-zinc-200 dark:file:hover:bg-black/50"
              />
            </label>

            {coverUploading ? (
              <p className="text-xs text-slate-500 dark:text-zinc-400">Uploading cover image...</p>
            ) : null}

            {(coverLocalPreview || coverImage) && (
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverLocalPreview ?? coverImage}
                  alt="Cover preview"
                  className="h-44 w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!coverFile || coverUploading}
                onClick={() => onUploadCoverImage()}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-black font-medium hover:bg-emerald-400 disabled:opacity-60 transition"
              >
                {coverUploading ? "Uploading..." : "Upload & Set Cover"}
              </button>

              <label className="flex-1 min-w-[220px]">
                <span className="text-sm text-slate-600 dark:text-zinc-300">Cover image URL (optional)</span>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="https://images..."
                />
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-sm text-slate-600 dark:text-zinc-300">Content (Markdown)</span>
            <div
              className="mt-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white overflow-hidden"
              data-color-mode={editorColorMode}
            >
              <MDEditor
                value={content}
                onChange={(val) => setContent(String(val ?? ""))}
                height={340}
                preview="live"
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-600 dark:text-zinc-300">Inline image upload</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                    Upload an image and it will be appended as Markdown:
                    <code className="text-slate-800 dark:text-zinc-200">![](...)</code>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setInlineFile(file);
                    setInlineLocalPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="text-sm text-slate-600 dark:text-zinc-300"
                />

                <input
                  value={inlineAltText}
                  onChange={(e) => setInlineAltText(e.target.value)}
                  className="flex-1 min-w-[180px] rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Alt text"
                />

                <button
                  type="button"
                  disabled={!inlineFile || inlineUploading}
                  onClick={() => onUploadAndInsertInlineImage()}
                  className="rounded-xl bg-cyan-400 px-4 py-2 text-black font-medium hover:bg-cyan-300 disabled:opacity-60 transition"
                >
                  {inlineUploading ? "Uploading..." : "Upload & Insert"}
                </button>
              </div>

              {inlineLocalPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={inlineLocalPreview}
                  alt="Inline preview"
                  className="h-32 w-full rounded-xl object-cover border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20"
                />
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
                  className="flex-1 min-w-[220px] rounded-xl border border-slate-200 dark:border-white/10 bg-white text-slate-900 dark:bg-black/30 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Or insert image by URL: https://..."
                />
                <button
                  type="button"
                  onClick={() => onInsertInlineImageUrl()}
                  disabled={!inlineImageUrl.trim()}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-slate-800 font-medium hover:bg-slate-200/80 disabled:opacity-60 transition dark:border-white/20 dark:text-zinc-100 dark:hover:bg-white/10"
                >
                  Insert URL
                </button>
              </div>

              {inlineUploading ? (
                <p className="text-xs text-slate-500 dark:text-zinc-400">Uploading inline image...</p>
              ) : null}
            </div>
          </label>

          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {createdUrl ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-900 dark:text-emerald-200">
              Post created successfully:{" "}
              <Link href={createdUrl} className="underline">
                {createdUrl}
              </Link>
            </div>
          ) : null}

          {editingSlug ? (
            <button
              type="button"
              onClick={saveEdit}
              disabled={submitting}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-black font-medium hover:bg-cyan-300 disabled:opacity-60 transition"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-black font-medium hover:bg-emerald-400 disabled:opacity-60 transition"
            >
              {submitting ? "Publishing..." : "Publish Post"}
            </button>
          )}
        </form>

        <section className="mt-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-white/5 p-6 md:p-8">
          <h2 className="text-xl font-semibold">Manage Posts</h2>
          {loadingPosts ? (
            <p className="text-slate-500 dark:text-zinc-400 mt-4">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-slate-500 dark:text-zinc-400 mt-4">No posts found.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                      {post.slug} · {post.category} · {post.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(post.slug)}
                      className="px-3 py-1.5 rounded-lg border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(post.slug)}
                      className="px-3 py-1.5 rounded-lg border border-red-400/40 text-red-200 hover:bg-red-400/10 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Registered Users</h2>
            <span className="text-sm text-slate-500 dark:text-zinc-400">
              {users.length} signed up
            </span>
          </div>

          {loadingUsers ? (
            <p className="text-slate-500 dark:text-zinc-400 mt-4">Loading users...</p>
          ) : usersError ? (
            <p className="text-red-500 dark:text-red-400 mt-4">{usersError}</p>
          ) : users.length === 0 ? (
            <p className="text-slate-500 dark:text-zinc-400 mt-4">No registered users yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700 dark:text-zinc-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-slate-50 dark:bg-black/20">
                      <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">{user.name}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-zinc-300">{user.email}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-zinc-300">{user.role}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-zinc-300">{new Date(user.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

