import axios from "axios";
import type { Discussion, DiscussionReply } from "../types/discussion.types";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchDiscussionsByChapter = async (
  courseId: string,
  chapterId: string
): Promise<Discussion[]> => {
  try {
    const response = await axios.get<Discussion[]>(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/discussions`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    throw error;
  }
};

export const fetchDiscussion = async (
  courseId: string,
  chapterId: string,
  discussionId: string
): Promise<Discussion> => {
  try {
    const response = await axios.get<Discussion>(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/discussions/${discussionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching discussion:", error);
    throw error;
  }
};

export const createDiscussion = async (
  courseId: string,
  chapterId: string,
  data: {
    title: string;
    content: string;
  }
): Promise<Discussion> => {
  try {
    const response = await axios.post<Discussion>(
      `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/discussions`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating discussion:", error);
    throw error;
  }
};

export const createReply = async (data: {
  discussionId: string;
  content: string;
  parentReplyId?: string | null;
}): Promise<DiscussionReply> => {
  console.log("Creating reply with data:", data);
  try {
    const response = await axios.post<DiscussionReply>(
      `${API_BASE_URL}/discussion-replies`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

export const fetchRepliesForParent = async (
  replyId: string
): Promise<DiscussionReply[]> => {
  try {
    const response = await axios.get<DiscussionReply[]>(
      `${API_BASE_URL}/discussion-replies/${replyId}/children`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching replies for parent:", error);
    throw error;
  }
};
