import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeChapter, getCourseById, getCourses } from "../api/courses.api";
import { useTranslation } from "@/lib/i18n";
export const useCourses = (courseId?: string) => {
  const { language } = useTranslation();
  const queryClient = useQueryClient();
  const fetchAllCourses = useQuery({
    queryKey: ["courses", language],
    queryFn: () => getCourses(),
  });

  const fetchCourseById = useQuery({
    queryKey: ["enrollment", "course", courseId],
    queryFn: () => getCourseById(courseId as string),
    enabled: !!courseId,
  });

  const markChapterComplete = useMutation({
    mutationFn: (variables: {
      courseId: string;
      chapterId: string;
      isCompleted: boolean;
    }) =>
      completeChapter(
        variables.courseId,
        variables.chapterId,
        variables.isCompleted
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "course", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["enrollment", "status", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["enrollments", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
  return {
    fetchCourseById,
    fetchAllCourses,
    markChapterComplete,
  };
};
