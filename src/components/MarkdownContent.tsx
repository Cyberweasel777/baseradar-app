import { remark } from "remark";
import remarkHtml from "remark-html";

export async function MarkdownContent({ content }: { content: string }) {
  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const html = processed.toString();

  return (
    <div
      className="prose prose-invert prose-zinc max-w-none
        prose-headings:text-white prose-headings:font-semibold
        prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-4
        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:text-cyan-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
        prose-blockquote:border-l-cyan-500 prose-blockquote:text-zinc-400
        prose-ul:text-zinc-300 prose-ol:text-zinc-300
        prose-li:my-1
        prose-table:text-zinc-300 prose-th:text-white prose-th:border-zinc-700 prose-td:border-zinc-800
        prose-hr:border-zinc-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
