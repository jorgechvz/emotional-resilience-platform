import { useAuthState } from "@/auth/hooks/use-auth-state";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"; 

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
}) => {
  const { isAuthenticated } = useAuthState();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location,
          showNotification: true,
          notificationTitle: "Acceso denegado",
          notificationDescription:
            "Debes iniciar sesión para acceder a esta página",
        }}
      />
    );
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
