export type ChapterNotesRequestType = {
    title: string;
    content: string;
    chapterId: string;
    courseId: string;
}

export type UpdateChapterNotesRequestType = ChapterNotesRequestType & {
    noteId: string;
}

export type DeleteChapterNoteRequestType = {
    noteId: string;
    chapterId: string;
    courseId: string;
}