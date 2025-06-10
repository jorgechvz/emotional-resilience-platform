import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react"; 
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuthState } from "@/auth/hooks/use-auth-state";
import { useAuth } from "@/auth/hooks/use-auth"; 
import { useTranslation } from "@/lib/i18n"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { useCallback } from "react";

export const NavigationSheet = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, isLoading } = useAuthState(); 
  const { signOut } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await signOut.mutateAsync();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [signOut, navigate]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getFullName = useCallback(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || "User";
  }, [user]);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full cursor-pointer"
        >
          <Menu />
          <span className="sr-only">{t("nav.openMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6 flex flex-col"> 
        <SheetHeader className="p-0 items-start -mt-2">
          <Logo size="lg"/>
          <VisuallyHidden>
            <SheetTitle>{t("nav.menuTitle")}</SheetTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <SheetDescription>
              {t("nav.menuDescription" )}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3 my-4 p-3 border rounded-md bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.firstName || ""} alt={getFullName()} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(getFullName())}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{getFullName()}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )}

        <div className="flex-1 mt-4"> 
          <NavMenu orientation="vertical" className="w-full" />
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-6 border-t mb-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-10">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout} disabled={signOut.isPending}>
                <LogOut className="mr-2 h-4 w-4" />
                {signOut.isPending ? t("nav.profile.signingOut") : t("nav.profile.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="w-full">
                <Button className="w-full">
                  {t("nav.login")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};