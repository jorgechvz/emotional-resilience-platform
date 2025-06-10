export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponseData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

export type UserRole = "USER" | "ADMIN";

export const UserRole = {
  USER: "USER" as UserRole,
  ADMIN: "ADMIN" as UserRole,
} as const;
