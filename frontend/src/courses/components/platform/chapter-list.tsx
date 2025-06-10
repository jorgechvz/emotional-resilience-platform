import { useCourseContext } from "@/courses/context/course-context";
import { ChapterItem } from "./chapter-item";

export const ChapterList = () => {
  const { chapters, activeLesson, completedLessons, setActiveLesson } =
    useCourseContext();

  return (
    <ul className="divide-y">
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          isActive={activeLesson === chapter.id}
          isCompleted={completedLessons.includes(chapter.id)}
          onClick={() => setActiveLesson(chapter.id)}
        />
      ))}
    </ul>
  );
};
