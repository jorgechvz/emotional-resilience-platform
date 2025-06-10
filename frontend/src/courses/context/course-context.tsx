import type {
  ChapterEntintyWithNotesAndProgressType,
  ChapterNotesType,
  ChapterProgressType,
} from "@/courses/types/courses.types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface CourseContextType {
  activeLesson: string;
  setActiveLesson: (id: string) => void;
  completedLessons: string[];
  setCompletedLessons: (lessons: string[]) => void;
  markComplete: (lessonId: string) => void;
  chapters: ChapterEntintyWithNotesAndProgressType[];
  currentChapter: ChapterEntintyWithNotesAndProgressType | undefined;
  goToNextLesson: () => void;
  goToPrevLesson: () => void;
  progress: number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
  chapters: ChapterEntintyWithNotesAndProgressType[];
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  chapters,
}) => {
  if (chapters.length === 0) return <>{children}</>;
  const [activeLesson, setActiveLesson] = useState<string>(chapters[0].id);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  useEffect(() => {
    if (chapters.length > 0 && !chapters.some((c) => c.id === activeLesson)) {
      setActiveLesson(chapters[0].id);
    }
  }, [chapters, activeLesson]);

  const foundChapter =
    chapters.find((chapter) => chapter.id === activeLesson) || chapters[0];

  const chapterNotes: ChapterNotesType[] = foundChapter?.chapterNotes || [];

  const chapterProgress: ChapterProgressType[] =
    foundChapter?.chapterProgress || [];

  useEffect(() => {
    const chaptersWithCompletedProgress = chapters
      .filter((chapter) =>
        chapter.chapterProgress?.some(
          (progress) => progress.isCompleted === true
        )
      )
      .map((chapter) => chapter.id);

    setCompletedLessons((prev) => {
      const combinedLessons = [...prev, ...chaptersWithCompletedProgress];
      return [...new Set(combinedLessons)];
    });
  }, [chapters]);
  const currentChapter: ChapterEntintyWithNotesAndProgressType = {
    ...foundChapter,
    chapterNotes: chapterNotes,
    chapterProgress: chapterProgress,
  };

  const progress =
    chapters.length > 0
      ? Math.round((completedLessons.length / chapters.length) * 100)
      : 0;

  const markComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      return;
    }

    const chapter = chapters.find((chapter) => chapter.id === lessonId);

    const isAlreadyCompleted = chapter?.chapterProgress?.some(
      (progress) => progress.isCompleted === true
    );

    if (!isAlreadyCompleted) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
  };

  const goToNextLesson = () => {
    markComplete(activeLesson);
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.id === activeLesson
    );
    if (currentIndex < chapters.length - 1) {
      setActiveLesson(chapters[currentIndex + 1].id);
    }
  };

  const goToPrevLesson = () => {
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.id === activeLesson
    );
    if (currentIndex > 0) {
      setActiveLesson(chapters[currentIndex - 1].id);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        activeLesson,
        setActiveLesson,
        completedLessons,
        setCompletedLessons,
        markComplete,
        chapters,
        currentChapter,
        goToNextLesson,
        goToPrevLesson,
        progress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
