import { create } from "zustand";
import type { FilterType, SortType } from "../types/discussion.types";

interface DiscussionUIState {
  expandedThreads: Set<string>;
  replyingTo: { discussionId: string; parentReplyId: string | null } | null;
  replyContent: string;
  filterBy: FilterType;
  sortBy: SortType;
  newDiscussion: { title: string; content: string };

  toggleThreadExpansion: (discussionId: string) => void;
  startReply: (discussionId: string, parentReplyId: string | null) => void;
  cancelReply: () => void;
  setReplyContent: (content: string) => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setNewDiscussionField: (field: "title" | "content", value: string) => void;
  resetNewDiscussion: () => void;
}

export const useDiscussionUIStore = create<DiscussionUIState>((set) => ({
  expandedThreads: new Set<string>(),
  replyingTo: null,
  replyContent: "",
  filterBy: "all",
  sortBy: "recent",
  newDiscussion: { title: "", content: "" },

  toggleThreadExpansion: (discussionId) =>
    set((state) => {
      const newSet = new Set(state.expandedThreads);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
      }
      return { expandedThreads: newSet };
    }),

  startReply: (discussionId, parentReplyId) =>
    set({
      replyingTo: { discussionId, parentReplyId },
      replyContent: "",
    }),

  cancelReply: () => set({ replyingTo: null, replyContent: "" }),

  setReplyContent: (content) => set({ replyContent: content }),

  setFilter: (filter) => set({ filterBy: filter }),

  setSort: (sort) => set({ sortBy: sort }),

  setNewDiscussionField: (field, value) =>
    set((state) => ({
      newDiscussion: {
        ...state.newDiscussion,
        [field]: value,
      },
    })),

  resetNewDiscussion: () =>
    set({
      newDiscussion: { title: "", content: "" },
    }),
}));
