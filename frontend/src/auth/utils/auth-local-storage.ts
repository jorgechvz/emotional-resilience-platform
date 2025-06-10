import { useAuthStore } from "../context/use-auth-store";

export const clearAuthStorage = () => {
  useAuthStore.persist.clearStorage();
};
