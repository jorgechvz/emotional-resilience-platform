import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Discussion, DiscussionReply } from "../types/discussion.types";
import {
  createDiscussion,
  createReply,
  fetchDiscussionsByChapter,
  fetchRepliesForParent,
} from "../api/discussions.api";

export const useChapterDiscussions = (courseId: string, chapterId: string) => {
  return useQuery<Discussion[]>({
    queryKey: ["discussions", courseId, chapterId],
    queryFn: () => fetchDiscussionsByChapter(courseId, chapterId),
  });
};

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      data,
    }: {
      courseId: string;
      chapterId: string;
      data: { title: string; content: string };
    }) => createDiscussion(courseId, chapterId, data),
    onSuccess: (_, variables) => {
      // Invalidar la consulta para refrescar la lista
      queryClient.invalidateQueries({
        queryKey: ["discussions", variables.courseId, variables.chapterId],
      });
    },
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReply,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["discussions"],
      });

      if (data.parentReplyId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", data.parentReplyId],
        });
      }
    },
  });
};

export const useRepliesForParent = (replyId: string, enabled = false) => {
  return useQuery<DiscussionReply[]>({
    queryKey: ["replies", replyId],
    queryFn: () => fetchRepliesForParent(replyId),
    enabled,
  });
};
