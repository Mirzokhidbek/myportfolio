import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-black dark:via-[#050809] dark:to-black dark:text-white px-6 py-10">
      <div className="max-w-md mx-auto rounded-3xl border border-slate-200 bg-white/90 dark:border-white/10 dark:bg-white/5 p-6 md:p-8">
        <Suspense
          fallback={<p className="text-slate-500 dark:text-zinc-400 text-sm">Loading…</p>}
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
