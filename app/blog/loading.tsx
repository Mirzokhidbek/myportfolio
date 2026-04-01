export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#070a0a] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 w-48 rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-6 w-2/3 rounded bg-white/10 animate-pulse" />
              <div className="mt-3 h-4 w-1/3 rounded bg-white/10 animate-pulse" />
              <div className="mt-4 h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="mt-2 h-4 w-5/6 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

