import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
  }
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "minimal";
  isScrolled?: boolean;
}

export const LanguageSwitcher = ({
  className,
  variant = "default",
  isScrolled = false,
}: LanguageSwitcherProps) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as "en" | "es" | "qu" | "ay");
    setIsOpen(false);
  };

  if (variant === "minimal") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 w-9 rounded-full p-0 transition-all duration-300",
              "hover:bg-muted/50 focus:bg-muted/50",
              isScrolled && "hover:bg-background/80",
              className
            )}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-background/95 backdrop-blur-lg border border-border/50"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {lang.nativeName}
                  </div>
                </div>
              </div>
              {language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 h-9 px-3 rounded-full transition-all duration-300",
            "hover:bg-muted/50 focus:bg-muted/50 text-muted-foreground hover:text-foreground",
            isScrolled && "hover:bg-background/80",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:inline">
              {currentLang.code.toUpperCase()}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-background/95 backdrop-blur-lg border border-border/50 shadow-xl"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            Seleccionar Idioma
          </div>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center justify-between cursor-pointer rounded-md p-3",
                "hover:bg-muted/50 focus:bg-muted/50",
                language === lang.code && "bg-primary/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-foreground">{lang.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {lang.nativeName}
                  </div>
                </div>
              </div>
              {language === lang.code && (
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Actual
                  </span>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
