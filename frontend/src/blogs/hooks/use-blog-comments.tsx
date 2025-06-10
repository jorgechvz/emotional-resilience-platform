import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNewComment,
  requestDeleteComment,
  requestLikeComment,
  requestUpdateComment,
} from "../api/blog-comment.api";

const useBlogComments = () => {
  const queryClient = useQueryClient();

  const createNewComment = useMutation({
    mutationFn: ({
      postId,
      content,
      author,
    }: {
      postId: string;
      content: string;
      author: string;
    }) => fetchNewComment(postId, content, author),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] }),
        queryClient.setQueryData(["blogComments", data.id], data);
    },
  });

  const updateComment = useMutation({
    mutationFn: ({
      commentId,
      content,
      author,
    }: {
      commentId: string;
      content: string;
      author?: string;
    }) => {
      if (!commentId) {
        throw new Error("Comment ID is required for updating a comment");
      }
      return requestUpdateComment(commentId, content, author || "");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
      queryClient.setQueryData(["blogComments", data.id], data);
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => {
      if (!commentId) {
        throw new Error("Comment ID is required for deleting a comment");
      }
      return requestDeleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });

  const likeComment = useMutation({
    mutationFn: (commentId: string) => {
      if (!commentId) {
        throw new Error("Comment ID is required for liking a comment");
      }
      return requestLikeComment(commentId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
      queryClient.setQueryData(["blogComments", data.id], data);
    },
  });

  return {
    createNewComment,
    updateComment,
    deleteComment,
    likeComment,
  };
};

export default useBlogComments;
