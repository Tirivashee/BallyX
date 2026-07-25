"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  LinkIcon,
  ImageIcon,
  Minus,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Client-only — Tiptap needs the DOM. The saved value is this editor's
// getHTML() output, re-sanitized server-side on every write (see
// lib/actions/blog.ts) — that's the real trust boundary, not this editor.
export function BlogEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write the post…" }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-64 rounded-b-md border border-t-0 border-ink/20 bg-paper-soft px-4 py-3 text-sm text-ink focus:outline-none [&_a]:text-accent-deep [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-ink/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-ink/5 [&_code]:px-1 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_ul]:list-disc",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const toolbarButtons: {
    label: string;
    icon: typeof Bold;
    onClick: () => void;
    active?: boolean;
  }[] = [
    {
      label: "Bold",
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
    },
    {
      label: "Heading 2",
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      icon: Heading3,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Bullet list",
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      label: "Quote",
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    {
      label: "Code block",
      icon: Code,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
    },
    { label: "Link", icon: LinkIcon, onClick: addLink, active: editor.isActive("link") },
    { label: "Image", icon: ImageIcon, onClick: addImage },
    { label: "Horizontal rule", icon: Minus, onClick: () => editor.chain().focus().setHorizontalRule().run() },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-md border border-ink/20 bg-paper p-2">
        {toolbarButtons.map(({ label, icon: Icon, onClick, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={onClick}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
