import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useCourseContext } from "@/courses/context/course-context";
import { useCourses } from "@/courses/hooks/use-courses"; 
import { useParams } from "react-router-dom"; 

export const LessonFooter = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const {
    chapters,
    activeLesson,
    completedLessons,
    goToNextLesson,
    goToPrevLesson,
    markComplete,
  } = useCourseContext();

  const { markChapterComplete } = useCourses();

  const handleMarkComplete = () => {
    if (!courseId || !activeLesson) return;

    markChapterComplete.mutate(
      {
        courseId,
        chapterId: activeLesson,
        isCompleted: true,
      },
      {
        onSuccess: () => {
          markComplete(activeLesson);
        },
      }
    );
  };

  return (
    <div className="flex w-full justify-between items-center border-t pt-6">
      <div>
        <Button
          variant="outline"
          onClick={goToPrevLesson}
          disabled={activeLesson === chapters[0]?.id}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("courses.previousLesson")}
        </Button>
      </div>

      <div>
        {completedLessons.includes(activeLesson) ? (
          <Button
            variant="outline"
            onClick={goToNextLesson}
            disabled={activeLesson === chapters[chapters.length - 1]?.id}
          >
            {t("courses.nextLesson")} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleMarkComplete}
            disabled={markChapterComplete.isPending}
          >
            {markChapterComplete.isPending
              ? t("common.loading")
              : t("courses.markComplete")}
          </Button>
        )}
      </div>
    </div>
  );
};
