import type { AxiosError } from "axios";
import type {
  ApiErrorResponse,
  SignInCredentials,
  SignInResponseData,
} from "../types/auth.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../context/use-auth-store";
import { signInUser, signOutUser, signUpUser } from "../api/auth.api";

export const useAuth = () => {
  const { login, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const signIn = useMutation<
    SignInResponseData,
    AxiosError<ApiErrorResponse>,
    SignInCredentials
  >({
    mutationFn: signInUser,
    onSuccess: (data: any) => {
      login(data.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  const registerUser = useMutation({
    mutationFn: (credentials: SignInCredentials) => signUpUser(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth", "signup"],
      });
    },
  });

  const signOut = useMutation<void, AxiosError<ApiErrorResponse>>({
    mutationFn: signOutUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    },
  });
  return {
    signIn,
    signOut,
    registerUser,
  };
};
