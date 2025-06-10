import { useTranslation } from "@/lib/i18n";
import type { NavRoute } from "../types/nav-routes.types";

export const useNavRoutes = (): NavRoute[] => {
  const { t } = useTranslation();
  
  return [
    {
      path: "/",
      element: t("nav.home"),
      isPublic: true,
    },
    {
      path: "/courses",
      element: t("nav.courses"),
      isPublic: true,
    },
    {
      path: "/resilience-circles",
      element: t("nav.findGroups"),
      isPublic: true,
    },
    {
      path: "/stories",
      element: t("nav.stories"),
      isPublic: true,
    },
  ];
};