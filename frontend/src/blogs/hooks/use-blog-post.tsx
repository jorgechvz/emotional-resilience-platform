import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlogPost,
  deleteBlogPost,
  fetchAllBlogPosts,
  fetchBlogPostById,
  likeBlogPost,
  updateBlogPost,
} from "../api/blog-post.api";

const useBlogPost = (storyId?: string) => {
  const queryClient = useQueryClient();

  const getAllBlogPosts = useQuery({
    queryKey: ["blogPosts"],
    queryFn: fetchAllBlogPosts,
  });

  const getBlogPostById = useQuery({
    queryKey: ["blogPost", storyId],
    queryFn: () => fetchBlogPostById(storyId || ""),
  });

  const newPostBlog = useMutation({
    mutationFn: createBlogPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["blogPosts"],
      });
      queryClient.setQueryData(["blogPost", data.id], data);
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({
      postId,
      blogPost,
    }: {
      postId: string;
      blogPost: {
        title?: string;
        content?: string;
        tags?: string[];
        author?: string | null;
      };
    }) => {
      if (!postId) {
        throw new Error("Post ID is required for updating a blog post");
      }
      return updateBlogPost(postId, blogPost);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["blogPosts"],
      });
      queryClient.setQueryData(["blogPost", data.id], data);
    },
  });

  const likeBlog = useMutation({
    mutationFn: likeBlogPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["blogPosts"],
      });
      queryClient.setQueryData(["blogPost", data.id], data);
    },
  });

  const deleteBlog = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["blogPosts"],
      });
      queryClient.removeQueries({
        queryKey: ["blogPost", variables],
      });
      queryClient.setQueryData(["blogPost", variables], undefined);
    },
  });
  return {
    getAllBlogPosts,
    getBlogPostById,
    newPostBlog,
    updateBlog,
    likeBlog,
    deleteBlog,
  };
};

export default useBlogPost;
