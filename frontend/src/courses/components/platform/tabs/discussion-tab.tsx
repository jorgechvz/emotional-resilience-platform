import { DiscussionForum } from "./discussion/discussion-forum";
import { useParams } from "react-router-dom";
import { useCourseContext } from "@/courses/context/course-context";

export const DiscussionTab = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentChapter } = useCourseContext();
  const chapterId = currentChapter?.id || "";
  return (
    <div className="mt-4">
      <DiscussionForum courseId={courseId as string} chapterId={chapterId} />
    </div>
  );
};
