export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#070a0a] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-40 rounded bg-white/10 animate-pulse" />
        <div className="mt-6 h-12 w-2/3 rounded bg-white/10 animate-pulse" />
        <div className="mt-4 h-4 w-1/4 rounded bg-white/10 animate-pulse" />
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="mt-3 h-4 w-full rounded bg-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}

