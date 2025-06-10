import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  /* User,
  Settings,
  Heart,
  Bell,
  BookOpen, */
  LogOut,
  ChevronDown,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { useAuthState } from "@/auth/hooks/use-auth-state";
import { useAuth } from "@/auth/hooks/use-auth";

interface UserProfileMenuProps {
  className?: string;
  isScrolled?: boolean;
}

export const UserProfileMenu = ({
  className,
  isScrolled = false,
}: UserProfileMenuProps) => {
  const { t } = useTranslation();
  const { user } = useAuthState();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut.mutateAsync();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Función para obtener el nombre completo
  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "User";
  };

  const menuItems = [
    {
      label: t("nav.home"),
      icon: Home,
      href: "/",
    } /* 
    // Implement later
    {
      label: t("nav.profile.profile"),
      icon: User,
      href: "/my/profile",
    },
    {
      label: t("nav.profile.courses"),
      icon: BookOpen,
      href: "/my/courses",
    },
    {
      label: t("nav.profile.progress"),
      icon: Heart,
      href: "/my/progress",
    },
    {
      label: t("nav.profile.notifications"),
      icon: Bell,
      href: "/my/notifications",
    },
    {
      label: t("nav.profile.settings"),
      icon: Settings,
      href: "/my/settings",
    }, */,
  ];

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 h-10 px-3 rounded-full transition-all duration-300",
            "hover:bg-muted/50 focus:bg-muted/50",
            isScrolled && "hover:bg-background/80",
            className
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.firstName || ""} alt={getFullName()} />
            <AvatarFallback className="bg-gradient-to-r from-chart-1 to-chart-2 text-white text-xs">
              {getInitials(getFullName())}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              {getFullName()}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>

          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200 text-muted-foreground",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-background/95 backdrop-blur-lg border border-border/50 shadow-xl"
        sideOffset={8}
      >
        {/* Header del usuario */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.firstName || ""} alt={getFullName()} />
              <AvatarFallback className="bg-gradient-to-r from-chart-1 to-chart-2 text-white">
                {getInitials(getFullName())}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {getFullName()}
              </span>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              {user?.isVerified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1 w-fit">
                  Verified
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu items */}
        <div className="p-1">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} className="p-0">
              <Link
                to={item.href}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={signOut.isPending}
            className="flex items-center gap-3 px-3 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">
              {signOut.isPending
                ? t("nav.profile.signingOut")
                : t("nav.profile.signOut")}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
