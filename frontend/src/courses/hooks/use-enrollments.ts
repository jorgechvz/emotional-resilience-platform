import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkEnrollment,
  enrollInCourse,
  getEnrollmentsByCourseId,
  getUserEnrollments,
} from "../api/enrollments.api";
import { useAuthStore } from "@/auth/context/use-auth-store";
import type { MyEnrollments } from "../types/enrollments.types";

export const useEnrollments = (courseId?: string) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", "my"],
    queryFn: getUserEnrollments,
    enabled: isAuthenticated,
  });

  const isEnrolledInCourse = (courseId: string): boolean => {
    if (!enrollmentsQuery.data) return false;

    return enrollmentsQuery.data.some(
      (enrollment) => enrollment.courseId === courseId
    );
  };

  const enrollUserInCourse = useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", "my"] });
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "status", variables],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "course", variables],
      });
    },
    onError: (error) => {
      console.error("Error enrolling in course:", error);
    },
  });

  const getEnrollmentForCourse = (
    courseId: string
  ): MyEnrollments | undefined => {
    if (!enrollmentsQuery.data) return undefined;

    return enrollmentsQuery.data.find(
      (enrollment) => enrollment.courseId === courseId
    );
  };

  const courseEnrollmentStatus = useQuery({
    queryKey: ["enrollment", "status", courseId],
    queryFn: () => checkEnrollment(courseId || ""),
    enabled: isAuthenticated && !!courseId,
  });

  const fetchEnrollmentCourseDetail = useQuery({
    queryKey: ["enrollment", "course", courseId],
    queryFn: () => getEnrollmentsByCourseId(courseId!),
    enabled:
      isAuthenticated &&
      !!courseId &&
      courseEnrollmentStatus.isSuccess &&
      courseEnrollmentStatus.data?.enrolled,
  });

  return {
    isEnrolledInCourse,
    getEnrollmentForCourse,
    courseEnrollmentStatus,
    fetchEnrollmentCourseDetail,
    enrollUserInCourse,
  };
};
