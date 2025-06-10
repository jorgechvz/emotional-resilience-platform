import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCurrentUser } from "../api/auth.api";
import { clearAuthStorage } from "../utils/auth-local-storage";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => {
        const currentState = get();
        const newAuth = !!user;

        if (
          currentState.user !== user ||
          currentState.isAuthenticated !== newAuth
        ) {
          set({
            user,
            isAuthenticated: newAuth,
          });
        }
      },

      setLoading: (isLoading) => {
        const currentLoading = get().isLoading;
        if (currentLoading !== isLoading) {
          set({ isLoading });
        }
      },

      setInitialized: (isInitialized) => {
        const currentInitialized = get().isInitialized;
        if (currentInitialized !== isInitialized) {
          set({ isInitialized });
        }
      },

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      checkAuth: async () => {
        const state = get();

        if (state.isInitialized || state.isLoading) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await getCurrentUser();
          if (response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
            clearAuthStorage();
          } else {
            set({
              isLoading: false,
              isInitialized: true,
            });
          }
          console.error("Auth check failed:", error);
        }
      },

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
              firstName: state.user.firstName,
              lastName: state.user.lastName,
              isVerified: state.user.isVerified,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
        isLoading: state.isLoading,
      }),
    }
  )
);
