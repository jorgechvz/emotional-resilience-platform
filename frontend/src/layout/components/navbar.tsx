import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Logo } from "./logo";
import { UserProfileMenu } from "./user-profile-menu";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { useAuthState } from "@/auth/hooks/use-auth-state";

const LoadingSkeleton = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
    <div className="hidden sm:block w-20 h-4 bg-muted animate-pulse rounded"></div>
  </div>
);

const AuthButtons = () => {
  const { t } = useTranslation();

  return (
    <>
      <Link to="/auth/login" className="hidden sm:inline-flex">
        <Button
          className={cn(
            "rounded-full transition-all duration-300 cursor-pointer"
          )}
        >
          {t("nav.login")}
        </Button>
      </Link>
    </>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 200);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = useMemo(
    () =>
      cn(
        "h-16 max-w-screen-xl mx-auto transition-all duration-300 ease-in-out",
        isScrolled
          ? [
              "fixed top-6 inset-x-4 z-50",
              "backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50",
              "rounded-full shadow-xl shadow-black/5",
              "animate-in slide-in-from-top-3 fade-in-0",
            ]
          : ["relative mt-6 mx-auto"]
      ),
    [isScrolled]
  );

  return (
    <>
      {isScrolled && <div className="h-28" />}

      <nav className={navClasses}>
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-14">
            <Logo size="xl" />
            <NavMenu className="hidden md:flex" />
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="minimal" isScrolled={isScrolled} />

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserProfileMenu isScrolled={isScrolled} />
                ) : (
                  <AuthButtons />
                )}
              </>
            )}

            {isLoading && <LoadingSkeleton />}

            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
