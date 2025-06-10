export interface UserSummary {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: string | null;
  likes: number;
  user: UserSummary;
  blogPostId: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: string | null;
  likes: number;
  tags: string[];
  user: UserSummary;
  comments?: BlogComment[];
  commentsCount?: number;
}

export type BlogPostResponse = Omit<BlogPost, "comments" | "commentsCount"> & {
  _count: {
    comments: number;
  };
};

export interface CreateBlogPostForm {
  title: string;
  content: string;
  tags: string[];
  author?: string;
}

export interface UpdateBlogPostForm {
  title?: string;
  content?: string;
  tags?: string[];
  author?: string;
}

export interface CreateBlogCommentForm {
  content: string;
  author?: string;
}

export interface UpdateBlogCommentForm {
  content?: string;
  author?: string;
}
