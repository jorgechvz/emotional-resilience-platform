import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useParams } from "react-router-dom";
import { useCourseContext } from "@/courses/context/course-context";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Save,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  Ellipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChapterNotesType } from "@/courses/types/courses.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotes } from "@/courses/hooks/use-notes";
import { toast } from "sonner";
export const NotesTab = () => {
  const { t } = useTranslation();
  const { courseId: courseIdFromParams } = useParams<{ courseId: string }>();
  const { currentChapter } = useCourseContext();

  const {
    useCreateChapterNote: createChapterNoteMutation,
    useUpdateChapterNote: updateChapterNoteMutation,
    useDeleteChapterNote: deleteChapterNoteMutation,
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<ChapterNotesType[]>([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentEditingNoteId, setCurrentEditingNoteId] = useState<
    string | null
  >(null);
  const [noteTitleInput, setNoteTitleInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  useEffect(() => {
    if (currentChapter?.chapterNotes) {
      setNotes(currentChapter.chapterNotes);
    } else {
      setNotes([]);
    }
  }, [currentChapter]);

  const filteredNotes = notes.filter((note) => {
    const titleMatch =
      note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch =
      note.content &&
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || contentMatch;
  });

  const handleOpenNewNoteEditor = () => {
    setCurrentEditingNoteId(null);
    setNoteTitleInput(t("courses.newNote"));
    editor?.commands.setContent("");
    setIsEditorOpen(true);
  };

  const handleOpenEditNoteEditor = (note: ChapterNotesType) => {
    setCurrentEditingNoteId(note.id);
    setNoteTitleInput(note.title);
    editor?.commands.setContent(note.content);
    setIsEditorOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setCurrentEditingNoteId(null);
    setNoteTitleInput("");
    editor?.commands.setContent("");
  };

  const handleSaveNote = () => {
    if (!editor || !currentChapter || !courseIdFromParams) {
      toast.error(t("common.error"), {
        description: t("courses.errorMissingInfo"),
        richColors: true,
      });
      return;
    }

    const content = editor.getHTML();
    const title = noteTitleInput.trim() || t("courses.untitledNote");

    if (currentEditingNoteId) {
      updateChapterNoteMutation.mutate(
        {
          noteId: currentEditingNoteId,
          courseId: courseIdFromParams,
          chapterId: currentChapter.id,
          title,
          content,
        },
        {
          onSuccess: () => {
            toast.success(t("courses.noteUpdated"), {
              richColors: true,
            });
            handleCancelEdit();
          },
          onError: (error: any) => {
            toast.error(t("common.error"), {
              description: error?.message || t("courses.errorUpdatingNote"),
              richColors: true,
            });
          },
        }
      );
    } else {
      createChapterNoteMutation.mutate(
        {
          courseId: courseIdFromParams,
          chapterId: currentChapter.id,
          title,
          content,
        },
        {
          onSuccess: () => {
            toast.success(t("courses.noteCreated"), {
              richColors: true,
            });
            handleCancelEdit();
          },
          onError: (error: any) => {
            toast.error(t("common.error"), {
              description: error?.message || t("courses.errorCreatingNote"),
              richColors: true,
            });
          },
        }
      );
    }
  };

  const handleDeleteNotePermanently = (noteId: string) => {
    if (!currentChapter || !courseIdFromParams) {
      toast.error(t("common.error"), {
        description: t("courses.errorMissingInfoOnDelete"),
        richColors: true,
      });
      return;
    }
    deleteChapterNoteMutation.mutate(
      {
        noteId,
        courseId: courseIdFromParams,
        chapterId: currentChapter.id,
      },
      {
        onSuccess: () => {
          toast.success(t("courses.noteDeleted"), {
            richColors: true,
          });
          if (currentEditingNoteId === noteId) {
            handleCancelEdit();
          }
        },
        onError: (error: any) => {
          toast(t("common.error"), {
            description: error?.message || t("courses.errorDeletingNote"),
            richColors: true,
          });
        },
      }
    );
  };

  const isSaving =
    updateChapterNoteMutation.isPending || createChapterNoteMutation.isPending;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("courses.myNotes")}
            </h3>
            <p className="text-sm text-neutral-600">
              {currentChapter?.chapterNotes.length} {t("courses.notes")} •{" "}
              {t("courses.lessonLabel")} {currentChapter?.position || 1}
            </p>
          </div>
          <Button
            onClick={handleOpenNewNoteEditor}
            size={"sm"}
            disabled={isEditorOpen || isSaving}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("courses.newNoteButton")}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder={t("courses.searchNotesPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {isEditorOpen && (
          <div className="p-4 border rounded-lg shadow-sm">
            <Input
              value={noteTitleInput}
              onChange={(e) => setNoteTitleInput(e.target.value)}
              placeholder={t("courses.noteTitlePlaceholder")}
              className="mb-4 text-lg font-medium"
              disabled={isSaving}
            />

            <div className="border rounded-lg mb-4">
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                {/* Editor Toolbar Buttons (unchanged, ensure editor instance is passed if needed) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  data-active={editor?.isActive("bold")}
                  disabled={isSaving}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  data-active={editor?.isActive("italic")}
                  disabled={isSaving}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                  data-active={editor?.isActive("underline")}
                  disabled={isSaving}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  data-active={editor?.isActive("heading", { level: 2 })}
                  disabled={isSaving}
                >
                  <span className="font-bold">H1</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  data-active={editor?.isActive("heading", { level: 3 })}
                  disabled={isSaving}
                >
                  <span className="font-bold">H2</span>
                </Button>
                <Separator orientation="vertical" className="mx-1 h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  data-active={editor?.isActive("bulletList")}
                  disabled={isSaving}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  data-active={editor?.isActive("orderedList")}
                  disabled={isSaving}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  data-active={editor?.isActive({ textAlign: "left" })}
                  disabled={isSaving}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  data-active={editor?.isActive({ textAlign: "center" })}
                  disabled={isSaving}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  data-active={editor?.isActive({ textAlign: "right" })}
                  disabled={isSaving}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo() || isSaving}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo() || isSaving}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              <div
                className={`p-3 min-h-[200px] max-w-none prose prose-sm ${
                  isSaving ? "opacity-50" : ""
                }`}
              >
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="flex justify-end gap-x-2 items-center">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                size="sm"
                disabled={isSaving}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveNote} size="sm" disabled={isSaving}>
                {isSaving ? (
                  t("common.saving")
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> {t("common.save")}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredNotes.length === 0 && !isEditorOpen ? (
            <Card className="border-dashed border-2 border-neutral-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">
                  {searchTerm
                    ? t("courses.noNotesFound")
                    : t("courses.noNotesYet")}
                </h3>
                <p className="text-neutral-500 text-center mb-4">
                  {searchTerm
                    ? t("courses.tryDifferentSearch")
                    : t("courses.noNotesDescription")}
                </p>
                {!searchTerm && (
                  <Button onClick={handleOpenNewNoteEditor} variant="outline">
                    {t("courses.createFirstNoteButton")}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleOpenEditNoteEditor(note)}
                onDelete={() => handleDeleteNotePermanently(note.id)}
                isDeleting={
                  deleteChapterNoteMutation.isPending &&
                  deleteChapterNoteMutation.variables?.noteId === note.id
                }
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

function NoteCard({
  note,
  onEdit,
  onDelete,
  isDeleting,
}: {
  note: ChapterNotesType;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditClick = () => {
    if (isDeleting) return;
    onEdit();
    setIsPopoverOpen(false);
  };

  const handleDeleteRequest = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(true);
    setIsPopoverOpen(false);
  };

  const confirmDelete = () => {
    if (isDeleting) return;
    onDelete();
    setShowDeleteConfirm(false);
  };

  const getSnippet = (htmlContent: string, maxLength = 100) => {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 border-neutral-200 hover:border-sage-300 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-neutral-800 group-hover:text-sage-700 transition-colors truncate">
              {note.title}
            </CardTitle>
            <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(note.createdAt)}
              </span>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <span className="flex items-center gap-1 text-neutral-400">
                  <Edit className="w-3 h-3" />
                  {t("common.updatedLabel")} {formatDate(note.updatedAt)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-neutral-500 hover:text-neutral-700"
                  disabled={isDeleting}
                >
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col gap-1 p-1 w-32"
                align="end"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="w-full justify-start text-sm h-8"
                  disabled={isDeleting}
                >
                  <Edit className="w-3.5 h-3.5 mr-2" />
                  {t("common.edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteRequest}
                  className="w-full justify-start text-sm h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  {t("common.delete")}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      {!showDeleteConfirm && note.content && (
        <CardContent
          className="pt-0"
          onClick={handleEditClick}
          style={{ cursor: isDeleting ? "default" : "pointer" }}
        >
          <div className="prose prose-sm max-w-none text-neutral-600 line-clamp-3">
            {getSnippet(note.content)}
          </div>
        </CardContent>
      )}
      {showDeleteConfirm && (
        <CardContent className="pt-2">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700 mb-3">
              {t("common.deleteConfirmPrompt")}
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
