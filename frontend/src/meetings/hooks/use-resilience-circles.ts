import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllResilienceCircles,
  getResilienceCircleById,
} from "../api/resilience-circles.api";
import {
  cancelEnrollment,
  enrollUserInCircle,
} from "../api/resilience-circles-enrollments.api";
import type { EnrollmentStatus } from "../types/resilience-circles.types";

const useResilienceCircles = (circleId?: string, enrollmentId?: string) => {
  const queryClient = useQueryClient();

  const fetchAllResilienceCircles = useQuery({
    queryKey: ["resilienceCircles"],
    queryFn: getAllResilienceCircles,
  });

  const fetchResilienceCircleById = useQuery({
    queryKey: ["resilienceCircle", circleId],
    queryFn: () => getResilienceCircleById(circleId || ""),
  });

  const fetchEnrollUserInCircle = useMutation({
    mutationFn: ({
      circleId,
      status,
    }: {
      circleId: string;
      status: EnrollmentStatus;
    }) => {
      return enrollUserInCircle(circleId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resilienceCircles"] });
      if (circleId) {
        queryClient.invalidateQueries({
          queryKey: ["resilienceCircle", circleId],
        });
      }
    },
  });

  const fetchCancelEnrollment = useMutation({
    mutationFn: (enrollmentId: string) => {
      return cancelEnrollment(enrollmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resilienceCircles"] });
      if (circleId) {
        queryClient.invalidateQueries({
          queryKey: ["resilienceCircle", circleId],
        });
      }
      if (enrollmentId) {
        queryClient.invalidateQueries({
          queryKey: ["resilienceCircleEnrollment", enrollmentId],
        });
      }
    },
  });

  return {
    fetchAllResilienceCircles,
    fetchResilienceCircleById,
    fetchEnrollUserInCircle,
    fetchCancelEnrollment,
  };
};

export default useResilienceCircles;
