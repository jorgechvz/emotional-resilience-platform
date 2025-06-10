import { useParams } from "react-router-dom";
import { useEnrollments } from "../hooks/use-enrollments";
import { LoadingState } from "./platform/state/loading-state";
import { EnrollmentState } from "./platform/state/enrollment-state";
import { ErrorState } from "./platform/state/error-state";
import { CourseProvider } from "../context/course-context";
import { CourseSidebar } from "./platform/course-sidebar";
import { LessonContent } from "./platform/lesson-content";

const CoursePlatform = () => {
  const { courseId } = useParams();
  const { courseEnrollmentStatus, fetchEnrollmentCourseDetail } =
    useEnrollments(courseId);
  const { data: enrollmentStatus, isLoading, isError } = courseEnrollmentStatus;
  const { data: enrollment, isLoading: courseLoading } =
    fetchEnrollmentCourseDetail;

  if (isLoading || courseLoading) {
    return <LoadingState />;
  }
  if (!enrollmentStatus?.enrolled) {
    return <EnrollmentState />;
  }

  if (isError || !enrollment) {
    return <ErrorState />;
  }

  const chapters = enrollment?.course?.chapters ?? [];

  if (chapters.length === 0) {
    return <LoadingState />;
  }

  return (
    <CourseProvider chapters={chapters}>
      <div className="container py-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row gap-6">
          <CourseSidebar courseTitle={enrollment.course.title} />
          <LessonContent />
        </div>
      </div>
    </CourseProvider>
  );
};

export default CoursePlatform;
