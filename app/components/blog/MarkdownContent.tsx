import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

import type { Components } from "react-markdown";

export default function MarkdownContent({ content }: { content: string }) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-4 text-3xl font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mt-10 mb-4 text-2xl font-semibold tracking-tight scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-8 mb-3 text-xl font-semibold tracking-tight scroll-mt-24"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 leading-relaxed text-slate-700 dark:text-zinc-200">{children}</p>
    ),
    a: ({ href, children, ...props }) => {
      const isExternal = typeof href === "string" && !href.startsWith("/");
      return (
        <a
          href={href}
          className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200 underline decoration-emerald-400/30 hover:decoration-emerald-500/50 dark:hover:decoration-emerald-300/70 transition"
          {...(isExternal
            ? { target: "_blank", rel: "noreferrer" }
            : undefined)}
          {...props}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="mt-4 ml-6 list-disc text-slate-700 dark:text-zinc-200">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-4 ml-6 list-decimal text-slate-700 dark:text-zinc-200">{children}</ol>
    ),
    li: ({ children }) => <li className="mt-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 rounded-2xl border border-slate-200 bg-slate-100/80 p-4 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
        <div className="text-slate-600 dark:text-zinc-300 italic">“{children}”</div>
      </blockquote>
    ),
    hr: () => (
      <hr className="my-10 border-slate-200 dark:border-white/10" />
    ),
    table: ({ children }) => (
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/30">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-200/60 dark:bg-white/5">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-sm font-medium text-slate-800 dark:text-zinc-200 border-b border-slate-200 dark:border-white/10">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-white/10 align-top">
        {children}
      </td>
    ),
    pre: ({ children }) => (
      <pre className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-black/40 p-4">
        {children}
      </pre>
    ),
    code: (props) => {
      const { className, children } = props;
      // react-markdown's TS types don't always expose `inline`; use a safe runtime check.
      const maybeInline = (props as { inline?: unknown }).inline;
      const isInline = typeof maybeInline === "boolean" ? maybeInline : false;

      const languageMatch = /language-(\w+)/.exec(className ?? "");
      const language = languageMatch?.[1];

      if (isInline) {
        return (
          <code className="rounded bg-emerald-50 px-1.5 py-0.5 text-sm text-emerald-900 border border-emerald-200 dark:bg-white/5 dark:text-emerald-200 dark:border-white/10">
            {children}
          </code>
        );
      }

      return (
        <code
          className="block text-sm leading-relaxed text-slate-800 dark:text-zinc-100"
          data-language={language}
          {...props}
        >
          {children}
        </code>
      );
    },
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/30"
      />
    ),
  };

  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

