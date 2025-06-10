import axios from "axios";
import type { BlogComment } from "../types/blog.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchNewComment = async (
  postId: string,
  content: string,
  author: string
): Promise<BlogComment> => {
  try {
    const { data } = await axios.post<BlogComment>(
      `${API_BASE_URL}/blog-posts/${postId}/comments`,
      { content, author },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const requestUpdateComment = async (
  commentId: string,
  content: string,
  author: string
): Promise<BlogComment> => {
  try {
    const { data } = await axios.patch<BlogComment>(
      `${API_BASE_URL}/blog-comments/${commentId}`,
      { content, author },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error(`Error updating comment with ID ${commentId}:`, error);
    throw error;
  }
};

export const fetchCommentById = async (
  commentId: string
): Promise<BlogComment> => {
  try {
    const { data } = await axios.get<BlogComment>(
      `${API_BASE_URL}/blog-comments/${commentId}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching comment with ID ${commentId}:`, error);
    throw error;
  }
};

export const requestDeleteComment = async (
  commentId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/blog-comments/${commentId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId}:`, error);
    throw error;
  }
};

export const requestLikeComment = async (
  commentId: string
): Promise<BlogComment> => {
  try {
    const { data } = await axios.post<BlogComment>(
      `${API_BASE_URL}/blog-comments/${commentId}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error(`Error liking comment with ID ${commentId}:`, error);
    throw error;
  }
};
