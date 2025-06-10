import { LanguageSwitcher } from "@/components/common/language-switcher";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "../components/logo";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full py-6 px-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Logo size="md" />
          </div>

          {/* Solo el selector de idioma */}
          <LanguageSwitcher variant="minimal" />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      {/* Footer minimal opcional */}
      <footer className="py-6 px-4 mt-auto bg-background border-border space-y-3">
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
        </div>
        <div className="max-w-screen-xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Resilire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
