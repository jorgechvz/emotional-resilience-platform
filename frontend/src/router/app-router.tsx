import { Route, Routes } from "react-router-dom";
import { AppRoutes, AuhtRoutes, PublicRoutes } from "./app-routes";
import ProtectedRoute from "./protected-route/protected-route";
import AuthLayout from "@/layout/page/auth-layout";
import Layout from "@/layout/page/layout";


export const AppRouter = () => {
  return (
    <Routes>
      {AuhtRoutes.map((route, index) => (
        <Route
          key={`auth-route-${index}`}
          path={route.path}
          element={<AuthLayout>{route.element}</AuthLayout>}
        />
      ))}
      {PublicRoutes.map((route, index) => (
        <Route
          key={`public-route-${index}`}
          path={route.path}
          element={<Layout>{route.element}</Layout>}
        />
      ))}
      {/* Protected Routes */}
      {AppRoutes.map((route, index) => (
        <Route
          key={`app-route-${index}`}
          path={route.path}
          element={
            <ProtectedRoute>
              <Layout>{route.element}</Layout>
            </ProtectedRoute>
          }
        ></Route>
      ))}
    </Routes>
  );
};
