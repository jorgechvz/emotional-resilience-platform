import axios from "axios";
import type { BlogPost, BlogPostResponse } from "../types/blog.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchAllBlogPosts = async (): Promise<BlogPostResponse[]> => {
  try {
    const { data } = await axios.get<BlogPostResponse[]>(
      `${API_BASE_URL}/blog-posts`
    );
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const { data } = await axios.get<BlogPost>(
      `${API_BASE_URL}/blog-posts/${id}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }
};

export const createBlogPost = async (blogPost: {
  title: string;
  content: string;
  tags: string[];
  author?: string | null;
}): Promise<BlogPost> => {
  try {
    const { data } = await axios.post<BlogPost>(
      `${API_BASE_URL}/blog-posts`,
      blogPost,
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

export const updateBlogPost = async (
  id: string,
  blogPost: {
    title?: string;
    content?: string;
    tags?: string[];
    author?: string | null;
  }
): Promise<BlogPost> => {
  try {
    const { data } = await axios.patch<BlogPost>(
      `${API_BASE_URL}/blog-posts/${id}`,
      blogPost,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/blog-posts/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};

export const likeBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const { data } = await axios.post<BlogPost>(
      `${API_BASE_URL}/blog-posts/${id}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error(`Error liking blog post with ID ${id}:`, error);
    throw error;
  }
};
