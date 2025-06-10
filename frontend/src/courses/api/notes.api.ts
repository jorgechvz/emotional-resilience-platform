import axios from "axios";
import type { ChapterNotesType } from "../types/courses.types";
import type {
  ChapterNotesRequestType,
  DeleteChapterNoteRequestType,
  UpdateChapterNotesRequestType,
} from "../types/notes.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const createChapterNote = async ({
  title,
  content,
  courseId,
  chapterId,
}: ChapterNotesRequestType): Promise<ChapterNotesType> => {
  try {
    const response = await axios.post<ChapterNotesType>(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/notes`,
      { title, content },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating chapter note:`, error);
    throw error;
  }
};

export const updateChapterNote = async ({
  noteId,
  chapterId,
  courseId,
  title,
  content,
}: UpdateChapterNotesRequestType): Promise<ChapterNotesType> => {
  try {
    const response = await axios.patch<ChapterNotesType>(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/notes/${noteId}`,
      { title, content },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating chapter note:`, error);
    throw error;
  }
};

export const deleteChapterNote = async ({
  noteId,
  chapterId,
  courseId,
}: DeleteChapterNoteRequestType) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/notes/${noteId}`,
      { withCredentials: true }
    );
  } catch (error) {
    console.error(`Error deleting chapter note:`, error);
    throw error;
  }
};
