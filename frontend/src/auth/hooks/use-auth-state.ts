import { useAuthStore } from "../context/use-auth-store";

export const useAuthState = () => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  };
};
