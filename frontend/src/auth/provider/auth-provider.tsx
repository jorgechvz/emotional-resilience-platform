import React, { useEffect } from "react";
import { useAuthStore } from "../context/use-auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { checkAuth, isInitialized, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized && !user) {
      checkAuth();
    }
  }, [checkAuth, isInitialized, user]);

  return <>{children}</>;
};
