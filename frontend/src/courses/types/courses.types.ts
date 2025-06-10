export type ChapterEntityType = {
  id: string;
  title: string;
  content: string;
  videoUrls: string[];
  duration: number;
  position: number;
  isPublished: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ChapterEntintyWithNotesAndProgressType = ChapterEntityType & {
  chapterNotes: ChapterNotesType[];
  chapterProgress: ChapterProgressType[];
};

export type ChapterProgressType = {
  chapterId: string;
  completedAt: string | null;
  createdAt: string;
  id: string;
  isCompleted: boolean;
  updatedAt: string;
  userId: string;
};
export type ChapterNotesType = {
  chapterId: string;
  content: string;
  createdAt: string;
  title: string;
  updatedAt: string;
  userId: string;
  id: string;
};
export type CreateCourseDtoType = {
  title: string;
  description?: string;
  imageUrl?: string;
};

export type UpdateCourseDtoType = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type CourseEntityType = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  chapters?: ChapterEntityType[];
};

