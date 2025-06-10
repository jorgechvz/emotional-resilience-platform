import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCourseContext } from "@/courses/context/course-context";
import { useTranslation } from "@/lib/i18n";
import { ChapterList } from "./chapter-list";

interface CourseSidebarProps {
  courseTitle: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseTitle,
}) => {
  const { t } = useTranslation();
  const { chapters, progress } = useCourseContext();

  const totalDuration = Math.round(
    chapters.reduce((total, chapter) => total + (chapter.duration || 0), 0) / 60
  );

  return (
    <div className="w-full md:w-1/3 lg:w-1/4">
      <Card>
        <CardHeader>
          <CardTitle>{courseTitle}</CardTitle>
          <CardDescription>
            {chapters.length} {t("courses.lessons")} • {totalDuration}{" "}
            {t("courses.minutes")}
          </CardDescription>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-right mt-1">
              {progress}% {t("courses.complete")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChapterList />
        </CardContent>
      </Card>
    </div>
  );
};
