export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface DiscussionReply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  discussionId: string;
  parentReplyId: string | null;
  childRepliesCount?: number;
  childReplies?: DiscussionReply[];
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  chapterId: string;
  user: User;
  repliesCount?: number;
  replies?: DiscussionReply[];
}

export type FilterType = "all" | "unanswered";
export type SortType = "recent" | "oldest" | "popular" | "unanswered";
