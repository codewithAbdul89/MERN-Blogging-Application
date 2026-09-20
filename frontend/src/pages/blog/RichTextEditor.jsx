import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import { FiLink } from "react-icons/fi";
import { FaListUl } from "react-icons/fa6";
import { FaUnlink } from "react-icons/fa";
import { TbListNumbers } from "react-icons/tb";

import Tooltip from "../../components/ui/Tooltip";

const RichTextEditor = ({ value = "", onChange, error }) => {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[420px] px-4 py-4 outline-none text-text-primary sm:min-h-[520px] sm:px-6 sm:py-6",
      },

      // ----------------------------------------
      // Keyboard shortcuts
      // ----------------------------------------

      handleKeyDown: (view, event) => {
        const isModKey = event.ctrlKey || event.metaKey;
        const key = event.key.toLowerCase();

        // ----------------------------------------
        // Ctrl + K / Cmd + K
        // Add / Edit Link
        // ----------------------------------------

        if (isModKey && !event.shiftKey && key === "k") {
          event.preventDefault();

          if (!editor) return true;

          const hasSelection = !editor.state.selection.empty;
          const isLinkActive = editor.isActive("link");

          if (!hasSelection && !isLinkActive) {
            return true;
          }

          const previousUrl = editor.getAttributes("link").href || "";

          const url = window.prompt("Enter URL:", previousUrl);

          if (url === null) return true;

          const trimmedUrl = url.trim();

          if (!trimmedUrl) return true;

          editor
            .chain()
            .focus()
            .setLink({
              href: trimmedUrl,
            })
            .run();

          return true;
        }

        // ----------------------------------------
        // Ctrl + Shift + K / Cmd + Shift + K
        // Remove Link
        // ----------------------------------------

        if (isModKey && event.shiftKey && key === "k") {
          event.preventDefault();

          if (!editor) return true;

          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          }

          return true;
        }

        return false;
      },
    },
  });

  // ----------------------------------------
  // Re-render toolbar when editor state changes
  // ----------------------------------------

  useEffect(() => {
    if (!editor) return;

    const rerender = () => forceUpdate((n) => n + 1);

    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);

    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  // ----------------------------------------
  // Keep editor synchronized with external value
  // ----------------------------------------

  useEffect(() => {
    if (!editor) return;

    if (!editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  // ----------------------------------------
  // Selection
  // ----------------------------------------

  const hasSelection = editor ? !editor.state.selection.empty : false;

  // ----------------------------------------
  // Case transformations
  // ----------------------------------------

  const applyCaseTransform = (transformFn) => {
    if (!editor) return;

    const { from, to, empty } = editor.state.selection;

    if (empty) return;

    const selectedText = editor.state.doc.textBetween(from, to, " ");

    const transformed = transformFn(selectedText);

    editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from,
          to,
        },
        transformed,
      )
      .run();
  };

  const toUpperCase = (text) => text.toUpperCase();

  const toLowerCase = (text) => text.toLowerCase();

  const toCapitalizedCase = (text) =>
    text.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );

  // ----------------------------------------
  // Add / Edit Link
  // ----------------------------------------

  const addLink = () => {
    if (!editor) return;

    const isLinkActive = editor.isActive("link");

    if (!hasSelection && !isLinkActive) return;

    const previousUrl = editor.getAttributes("link").href || "";

    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) return;

    editor
      .chain()
      .focus()
      .setLink({
        href: trimmedUrl,
      })
      .run();
  };

  // ----------------------------------------
  // Remove Link
  // ----------------------------------------

  const removeLink = () => {
    if (!editor) return;

    if (!editor.isActive("link")) return;

    editor.chain().focus().unsetLink().run();
  };

  if (!editor) return null;

  const isLinkActive = editor.isActive("link");

  return (
    <div
      className={`rounded-xl border bg-surface shadow-sm transition-colors ${
        error ? "border-red-500" : "border-border focus-within:border-primary"
      }`}
    >
      <style>{`
        .rte-content blockquote {
          position: relative;
          margin: 1.5rem 0;
          padding: 1rem 1.5rem 1rem 3.25rem;
          border-left: 4px solid var(--color-primary, currentColor);
          border-radius: 0.5rem;
          background: color-mix(
            in srgb,
            var(--color-primary, currentColor) 6%,
            transparent
          );
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
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-thickness: 1.5px;
          cursor: pointer;
        }

        .rte-content a:hover {
          opacity: 0.7;
        }

        .rte-content code {
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
        }

        .rte-content img {
          max-width: 100%;
          height: auto;
        }
      `}</style>

      {/* ======================================== */}
      {/* Sticky Toolbar */}
      {/* ======================================== */}

      <div
        className="
          sticky
          top-14
          md:top-0
          z-30

          flex
          min-h-10
          flex-wrap
          md:flex-nowrap
          md:overflow-x-scroll
          items-center
          gap-1

          overflow-x-auto

          border-b
          border-border

          bg-background/95
          p-2

          shadow-sm
          backdrop-blur-sm

          scrollbar-width:non
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* -------------------------------- */}
        {/* Bold */}
        {/* -------------------------------- */}

        <Tooltip text="Bold (Ctrl+B)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm font-bold transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("bold")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            B
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Italic */}
        {/* -------------------------------- */}

        <Tooltip text="Italic (Ctrl+I)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm italic transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("italic")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            I
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Strike */}
        {/* -------------------------------- */}

        <Tooltip text="Strikethrough (Ctrl+Shift+X)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm line-through transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("strike")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            S
          </button>
        </Tooltip>

        <span className="mx-1 h-6 w-px shrink-0 bg-border" />

        {/* -------------------------------- */}
        {/* Heading 1 */}
        {/* -------------------------------- */}

        <Tooltip text="Heading 1 (Ctrl+Alt+1)">
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 1,
                })
                .run()
            }
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm font-bold transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("heading", {
                level: 1,
              })
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            H1
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Heading 2 */}
        {/* -------------------------------- */}

        <Tooltip text="Heading 2 (Ctrl+Alt+2)">
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 2,
                })
                .run()
            }
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm font-bold transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("heading", {
                level: 2,
              })
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            H2
          </button>
        </Tooltip>

        <span className="mx-1 h-6 w-px shrink-0 bg-border" />

        {/* -------------------------------- */}
        {/* Bullet List */}
        {/* -------------------------------- */}

        <Tooltip text="Bullet List (Ctrl+Shift+8)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("bulletList")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            <FaListUl />
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Ordered List */}
        {/* -------------------------------- */}

        <Tooltip text="Numbered List (Ctrl+Shift+7)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("orderedList")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            <TbListNumbers />
          </button>
        </Tooltip>

        <span className="mx-1 h-6 w-px shrink-0 bg-border" />

        {/* -------------------------------- */}
        {/* Blockquote */}
        {/* -------------------------------- */}

        <Tooltip text="Blockquote (Ctrl+Shift+B)">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-surface hover:text-primary ${
              editor.isActive("blockquote")
                ? "bg-primary/10 text-primary"
                : "text-text-primary"
            }`}
          >
            &ldquo;
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Link */}
        {/* -------------------------------- */}

        <Tooltip
          text={
            isLinkActive
              ? "Edit Link (Ctrl+K)"
              : hasSelection
                ? "Add Link (Ctrl+K)"
                : "Select text first to add a link (Ctrl+K)"
          }
        >
          <button
            type="button"
            disabled={!hasSelection && !isLinkActive}
            onClick={addLink}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 ${
              isLinkActive ? "bg-primary/10 text-primary" : "text-text-primary"
            }`}
          >
            <FiLink size={17} />
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Remove Link */}
        {/* -------------------------------- */}

        <Tooltip text="Remove Link (Ctrl+Shift+K)">
          <button
            type="button"
            disabled={!isLinkActive}
            onClick={removeLink}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <FaUnlink size={17} />
          </button>
        </Tooltip>

        <span className="mx-1 h-6 w-px shrink-0 bg-border" />

        {/* -------------------------------- */}
        {/* Uppercase */}
        {/* -------------------------------- */}

        <Tooltip
          text={
            hasSelection
              ? "UPPERCASE selected text"
              : "Select text first to change its case"
          }
        >
          <button
            type="button"
            onClick={() => applyCaseTransform(toUpperCase)}
            disabled={!hasSelection}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              font-semibold
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            AA
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Lowercase */}
        {/* -------------------------------- */}

        <Tooltip
          text={
            hasSelection
              ? "lowercase selected text"
              : "Select text first to change its case"
          }
        >
          <button
            type="button"
            onClick={() => applyCaseTransform(toLowerCase)}
            disabled={!hasSelection}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              font-semibold
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            aa
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Capitalize */}
        {/* -------------------------------- */}

        <Tooltip
          text={
            hasSelection
              ? "Capitalize Each Word"
              : "Select text first to change its case"
          }
        >
          <button
            type="button"
            onClick={() => applyCaseTransform(toCapitalizedCase)}
            disabled={!hasSelection}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              font-semibold
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            Aa
          </button>
        </Tooltip>

        <span className="mx-1 h-6 w-px shrink-0 bg-border" />

        {/* -------------------------------- */}
        {/* Undo */}
        {/* -------------------------------- */}

        <Tooltip text="Undo (Ctrl+Z)">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ↶
          </button>
        </Tooltip>

        {/* -------------------------------- */}
        {/* Redo */}
        {/* -------------------------------- */}

        <Tooltip text="Redo (Ctrl+Y / Ctrl+Shift+Z)">
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              text-text-primary
              transition-colors
              hover:bg-surface
              hover:text-primary
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ↷
          </button>
        </Tooltip>
      </div>

      {/* ======================================== */}
      {/* Editor Content */}
      {/* ======================================== */}

      <EditorContent
        editor={editor}
        onContextMenu={(event) => event.preventDefault()}
        className="
          rte-content
          min-h-70
          sm:min-h-120
          p-4

          [&_p]:my-4
          [&_p]:leading-7
          [&_p]:text-[1.05rem]

          [&_h1]:my-4
          [&_h1]:text-2xl
          [&_h1]:font-bold
          [&_h1]:font-serif
          [&_h1]:leading-tight
          [&_h1]:tracking-tight

          [&_h2]:my-3
          [&_h2]:text-xl
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
          [&_code]:bg-background
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:text-sm
          [&_code]:text-primary

          [&_pre]:my-4
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-lg
          [&_pre]:border
          [&_pre]:border-border
          [&_pre]:bg-background
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
          [&_th]:bg-background
          [&_th]:px-3
          [&_th]:py-2
          [&_th]:text-left
          [&_th]:font-semibold

          [&_td]:border
          [&_td]:border-border
          [&_td]:px-3
          [&_td]:py-2

          [&_.ProseMirror]:min-h-50
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:focus:outline-none
        "
      />
    </div>
  );
};

export default RichTextEditor;
