import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading1,
  Heading2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  error = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline decoration-primary underline-offset-4",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden",
        error
          ? "border-red-300 focus-within:border-red-400"
          : "border-sage-200 focus-within:border-sage-400",
        className
      )}
    >
      <div className="bg-white border-b border-sage-100 p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("bold") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("italic") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-sage-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("heading", { level: 1 }) ? "bg-sage-100" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("heading", { level: 2 }) ? "bg-sage-100" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-sage-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("bulletList") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("orderedList") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-sage-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("blockquote") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            editor.isActive("codeBlock") ? "bg-sage-100" : ""
          }`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] prose max-w-none focus:outline-none"
      />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white shadow-lg rounded-md flex overflow-hidden border border-sage-200">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-none ${
                editor.isActive("bold") ? "bg-sage-100" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-none ${
                editor.isActive("italic") ? "bg-sage-100" : ""
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
