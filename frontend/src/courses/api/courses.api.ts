import axios from "axios";
import type { CourseEntityType } from "../types/courses.types";
import { getLanguage } from "../utils/course.lib";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getCourses = async (
  language?: "en" | "es" | "qu" | "ay"
): Promise<CourseEntityType[]> => {
  try {
    const lang = language || getLanguage();
    const response = await axios.get<CourseEntityType[]>(
      `${API_BASE_URL}/courses?language=${lang}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching courses:`, error);
    throw error;
  }
};

export const getCourseById = async (
  courseId: string
): Promise<CourseEntityType | null> => {
  try {
    const response = await axios.get<CourseEntityType>(
      `${API_BASE_URL}/courses/${courseId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching course by ID:`, error);
    return null;
  }
};

export const getChaptersCourseById = async (
  courseId: string
): Promise<CourseEntityType | null> => {
  try {
    const response = await axios.get<CourseEntityType>(
      `${API_BASE_URL}/courses/${courseId}/chapters`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching course:`, error);
    return null;
  }
};

export const completeChapter = async (
  courseId: string,
  chapterId: string,
  isCompleted: boolean
): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/progress`,
      { isCompleted },
      { withCredentials: true }
    );
  } catch (error) {
    console.error(`Error updating chapter progress:`, error);
    throw error;
  }
};
