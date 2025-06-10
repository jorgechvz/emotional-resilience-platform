import { Link, useLocation } from "react-router-dom";
import { useNavRoutes } from "../hooks/nav-routes";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface NavMenuProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const NavMenu = ({
  orientation = "horizontal",
  className,
}: NavMenuProps) => {
  const location = useLocation();
 const navRoutes = useNavRoutes();

  return (
    <nav
      className={cn(
        "flex",
        orientation === "vertical"
          ? "flex-col items-start gap-4"
          : "flex-row gap-4",
        className
      )}
    >
      {navRoutes.map((route) => {
        const isActive = location.pathname === route.path;

        return (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
              isActive && [
                "text-primary bg-primary/10",
                "hover:text-primary hover:bg-primary/15",
                "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-chart-1/20 before:to-chart-2/20 before:-z-10",
              ],
              orientation === "vertical" && [
                "w-full justify-between px-6 py-3 flex items-center",
              ]
            )}
          >
            <span>{route.element}</span>
            {orientation === "vertical" && (
              <ChevronRight className="size-4 flex-shrink-0" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
