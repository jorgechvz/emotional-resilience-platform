import axios from "axios";
import type {
  EnrollmentByCourse,
  EnrollmentDetailType,
  EnrollmentStatus,
  MyEnrollments,
} from "../types/enrollments.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getUserEnrollments = async (): Promise<MyEnrollments[]> => {
  try {
    const response = await axios.get<MyEnrollments[]>(
      `${API_BASE_URL}/enrollments/my`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return [];
  }
};

export const enrollInCourse = async (
  courseId: string
): Promise<EnrollmentDetailType> => {
  try {
    const response = await axios.post<EnrollmentDetailType>(
      `${API_BASE_URL}/enrollments`,
      { courseId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error enrolling in course ${courseId}:`, error);
    throw error;
  }
};

export const getEnrollmentsByCourseId = async (
  courseId: string
): Promise<EnrollmentByCourse | null> => {
  try {
    const response = await axios.get<EnrollmentByCourse>(
      `${API_BASE_URL}/enrollments/course/${courseId}/details`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    return null;
  }
};

export const checkEnrollment = async (
  courseId: string
): Promise<EnrollmentStatus | null> => {
  try {
    const response = await axios.get<EnrollmentStatus>(
      `${API_BASE_URL}/enrollments/course/${courseId}/status`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`Error checking enrollment for course ${courseId}:`, error);
    return null;
  }
};
