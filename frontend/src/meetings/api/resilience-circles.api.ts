import axios from "axios";
import type { ResilienceCircle } from "../types/resilience-circles.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getAllResilienceCircles = async (): Promise<
  ResilienceCircle[]
> => {
  try {
    const response = await axios.get<ResilienceCircle[]>(
      `${API_BASE_URL}/resilience-circles`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching resilience circles:", error);
    throw error;
  }
};

export const getResilienceCircleById = async (
  id: string
): Promise<ResilienceCircle> => {
  try {
    const response = await axios.get<ResilienceCircle>(
      `${API_BASE_URL}/resilience-circles/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching resilience circle with ID ${id}:`, error);
    throw error;
  }
};
