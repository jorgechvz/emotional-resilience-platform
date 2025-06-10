import type { ChapterEntintyWithNotesAndProgressType, CourseEntityType } from "./courses.types";

export type MyEnrollments = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
};

export type EnrollmentStatus = {
  enrolled: boolean;
  courseId: string;
};

export type EnrollmentByCourse = MyEnrollments & {
  course: CourseEntityType & {
    chapters: ChapterEntintyWithNotesAndProgressType[];
  };
  _count: number;
};


export type UserRole = "USER" | "ADMIN" | string;

export type UserProfileType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: UserRole;
  createdAt: string; 
  updatedAt: string; 
  lastLogin: string; 
};

export type BasicChapterType = {
  id: string;
  title: string;
  content: string;
  videoUrls: string[];
  duration: number; 
  position: number;
  isPublished: boolean;
  courseId: string;
  createdAt: string; 
  updatedAt: string; 
};

export type CourseWithBasicChaptersType = CourseEntityType & {
  chapters: BasicChapterType[];
};

export type EnrollmentDetailType = MyEnrollments & {
  user: UserProfileType;
  course: CourseWithBasicChaptersType;
};