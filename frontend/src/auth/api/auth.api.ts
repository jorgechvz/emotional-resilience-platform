import axios from "axios";
import type {
  SignInCredentials,
  SignInResponseData,
  SignUpCredentials,
} from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const signInUser = async (
  credentials: SignInCredentials
): Promise<SignInResponseData> => {
  const { data } = await axios.post<SignInResponseData>(
    `${API_BASE_URL}/auth/signin`,
    credentials,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const signUpUser = async (
  credentials: SignUpCredentials
): Promise<SignInResponseData> => {
  try {
    const { data } = await axios.post<SignInResponseData>(
      `${API_BASE_URL}/auth/signup`,
      credentials
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error signing up");
    }
    throw new Error("An unexpected error occurred during sign up");
  }
};

export const signOutUser = async (): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/auth/signout`,
    {},
    {
      withCredentials: true,
    }
  );
};

export const refreshToken = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    withCredentials: true,
  });
  return response.data;
};
