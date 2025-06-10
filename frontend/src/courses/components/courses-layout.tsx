import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useCourses } from "../hooks/use-courses";
import { useEnrollments } from "../hooks/use-enrollments";
import { getDuration } from "../utils/course.lib";
import { useTranslation } from "@/lib/i18n";
import { Play, BookOpen } from "lucide-react";
import { LoadingState } from "./platform/state/loading-state";

export default function CoursesLayout() {
  const { t } = useTranslation();
  const { fetchAllCourses } = useCourses();
  const { data: courses, isLoading, isError } = fetchAllCourses;
  const { isEnrolledInCourse } = useEnrollments();

  const renderCourseButton = (courseId: string) => {
    const isEnrolled = isEnrolledInCourse(courseId);

    if (isEnrolled) {
      return (
        <Button className="w-full cursor-pointer">
          <Play className="mr-2 h-4 w-4" />
          {t("courses.continue")}
        </Button>
      );
    } else {
      return (
        <Button className="w-full cursor-pointer">
          <BookOpen className="mr-2 h-4 w-4" />
          {t("courses.start")}
        </Button>
      );
    }
  };

  return (
    <div className="container py-10 mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 mx-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("courses.title")}
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t("courses.description")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mx-8">
        {isLoading && (
          <LoadingState />
        )}
        {isError && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center ">
            <p className="text-red-500">{t("courses.error")}</p>
          </div>
        )}
        {courses?.map((course) => {
          const isEnrolled = isEnrolledInCourse(course.id);

          return (
            <Card
              key={course.id}
              className={`relative ${isEnrolled ? "border-primary/50" : ""}`}
            >
              {isEnrolled && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-bl-md">
                  {t("courses.enrolled")}
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                </div>
                <CardDescription>
                  {course.chapters?.length} {t("courses.lessons")} •{" "}
                  {getDuration(course.chapters || [])} {t("courses.minutes")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: course.description || t("courses.noDescription"),
                  }}
                ></div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link to={`/platform/course/${course.id}`} className="w-full">
                  {renderCourseButton(course.id)}
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
