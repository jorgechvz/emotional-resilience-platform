import { Button } from "@/components/ui/button";
import { useCourses } from "@/courses/hooks/use-courses";
import { useEnrollments } from "@/courses/hooks/use-enrollments";
import { useTranslation } from "@/lib/i18n";
import { BookOpen, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const EnrollmentState = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { fetchCourseById } = useCourses(courseId as string);
  const { data: course } = fetchCourseById;
  const { enrollUserInCourse } = useEnrollments(courseId as string);

  const handleEnroll = () => {
    if (courseId) {
      const promise = enrollUserInCourse.mutateAsync(courseId);
      toast.promise(promise,
        {
          loading: t("state.enrolling"),
          success: () => {
            return t("state.enrollSuccess");
          },
          error: t("state.enrollError"),
          richColors: true,
        },)
    }
  };

  return (
    <div className="container py-16 mx-auto max-w-3xl px-4">
      <div className="rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-sage-600 to-sage-400 p-8">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-center">{course?.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("state.enrollmentRequired")}
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              {t("state.enrollmentMessage")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-sage-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                {t("state.accessMaterials")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("state.accessDescription")}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-sage-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                {t("state.trackProgress")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("state.progressDescription")}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleEnroll}
              disabled={enrollUserInCourse.isPending}
              size="lg"
              className="cursor-pointer"
            >
              {enrollUserInCourse.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  {t("state.enrolling")}
                </>
              ) : (
                <>
                  {t("state.enroll")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
