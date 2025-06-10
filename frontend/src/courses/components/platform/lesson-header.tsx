import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useCourseContext } from "@/courses/context/course-context";

export const LessonHeader = () => {
  const { t } = useTranslation();
  const {
    chapters,
    activeLesson,
    currentChapter,
    goToNextLesson,
    goToPrevLesson,
  } = useCourseContext();

  const lessonNumber =
    chapters.findIndex((chapter) => chapter.id === activeLesson) + 1 || 1;

  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>
          {t("courses.lesson")} {lessonNumber}: {currentChapter?.title}
        </CardTitle>
        <CardDescription>
          {Math.round((currentChapter?.duration || 0) / 60)}{" "}
          {t("courses.minutes")}
        </CardDescription>
      </div>
      <div className="hidden md:flex md:items-center md:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevLesson}
          disabled={activeLesson === chapters[0]?.id}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("courses.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextLesson}
          disabled={activeLesson === chapters[chapters.length - 1]?.id}
        >
          {t("courses.next")} <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
