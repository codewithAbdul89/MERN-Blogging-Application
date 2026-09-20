import DOMPurify from "dompurify";

const BlogContent = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content || "", {
  ADD_ATTR: ["target", "blank"],
});
  return (
    <div className="rte-content max-w-none text-text-primary">
      <style>{`
        .rte-content blockquote {
          position: relative;
          margin: 1.5rem 0;
          padding: 1rem 1.5rem 1rem 3.25rem;
          border-left: 4px solid var(--color-primary, currentColor);
          border-radius: 0.5rem;
          background: color-mix(in srgb, var(--color-primary, currentColor) 6%, transparent);
          font-style: italic;
        }

        .rte-content blockquote::before {
          content: "\\201C";
          position: absolute;
          left: 0.75rem;
          top: 0.35rem;
          font-size: 2.5rem;
          line-height: 1;
          font-family: Georgia, "Times New Roman", serif;
          color: var(--color-primary, currentColor);
          opacity: 0.5;
        }

        .rte-content blockquote::after {
          content: "\\201D";
          font-size: 1.75rem;
          line-height: 1;
          font-family: Georgia, "Times New Roman", serif;
          margin-left: 0.25rem;
          opacity: 0.5;
        }

        .rte-content blockquote p {
          margin: 0;
        }

        .rte-content a {
          text-decoration-thickness: 1.5px;
        }

        .rte-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .rte-content img {
          max-width: 100%;
          height: auto;
        }
      `}</style>

      <div
        className="
          [&_p]:my-4
          [&_p]:leading-7
          [&_p]:text-[1.05rem]

          [&_h1]:my-4
          [&_h1]:text-3xl
          [&_h1]:font-bold
          [&_h1]:font-serif
          [&_h1]:leading-tight
          [&_h1]:tracking-tight

          [&_h2]:my-3
          [&_h2]:text-2xl
          [&_h2]:font-semibold
          [&_h2]:font-serif
          [&_h2]:leading-snug
          [&_h2]:tracking-tight

          [&_h3]:my-4
          [&_h3]:text-xl
          [&_h3]:font-semibold
          [&_h3]:font-serif
          [&_h3]:leading-snug

          [&_strong]:font-bold
          [&_em]:italic
          [&_s]:line-through
          [&_del]:line-through

          [&_ul]:my-2
          [&_ul]:list-disc
          [&_ul]:pl-6
          [&_ul]:space-y-1

          [&_ol]:my-2
          [&_ol]:list-decimal
          [&_ol]:pl-6
          [&_ol]:space-y-1

          [&_li]:my-1
          [&_li]:leading-7

          [&_a]:font-medium
          [&_a]:text-primary
          [&_a]:underline
          [&_a]:underline-offset-2
          [&_a]:transition-opacity
          [&_a]:hover:opacity-70

          [&_hr]:my-8
          [&_hr]:border-border

          [&_code]:rounded
          [&_code]:bg-surface
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:text-sm
          [&_code]:text-primary

          [&_pre]:my-4
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-lg
          [&_pre]:border
          [&_pre]:border-border
          [&_pre]:bg-surface
          [&_pre]:p-4
          [&_pre]:text-sm

          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0
          [&_pre_code]:text-text-primary

          [&_img]:my-6
          [&_img]:rounded-xl
          [&_img]:shadow-sm

          [&_table]:my-4
          [&_table]:w-full
          [&_table]:border-collapse
          [&_table]:overflow-hidden
          [&_table]:rounded-lg
          [&_table]:border
          [&_table]:border-border

          [&_th]:border
          [&_th]:border-border
          [&_th]:bg-surface
          [&_th]:px-3
          [&_th]:py-2
          [&_th]:text-left
          [&_th]:font-semibold

          [&_td]:border
          [&_td]:border-border
          [&_td]:px-3
          [&_td]:py-2
        "
        dangerouslySetInnerHTML={{
          __html: sanitizedContent,
        }}
      />
    </div>
  );
};

export default BlogContent;