import axios from "axios";
import type {
  EnrollmentStatus,
  ResilienceCircleEnrollment,
} from "../types/resilience-circles.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const enrollUserInCircle = async (
  circleId: string,
  status: EnrollmentStatus
): Promise<ResilienceCircleEnrollment> => {
  try {
    const response = await axios.post<ResilienceCircleEnrollment>(
      `${API_BASE_URL}/resilience-circles/${circleId}/enrollments`,
      { status },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error enrolling user in circle with ID ${circleId}:`, error);
    throw error;
  }
};

export const cancelEnrollment = async (
  enrollmentId: string
): Promise<ResilienceCircleEnrollment> => {
  try {
    const response = await axios.patch<ResilienceCircleEnrollment>(
      `${API_BASE_URL}/resilience-enrollments/${enrollmentId}/cancel`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error canceling enrollment in circle with ID ${enrollmentId}:`,
      error
    );
    throw error;
  }
};
