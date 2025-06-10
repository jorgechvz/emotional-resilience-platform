import { useTranslation } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

export const LoadingState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  const loadingMessage = message || t("common.loading");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-primary/70 to-primary animate-pulse blur-xl opacity-30"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/30 to-primary/70 animate-pulse delay-300 blur-lg opacity-20"></div>

        <div className="relative flex flex-col items-center justify-center p-8 rounded-lg bg-card/90 shadow-xl">
          <div className="w-24 h-24 mb-4 bg-gradient-to-r from-accent via-primary to-secondary rounded-full flex items-center justify-center p-1">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
              <img src="/logo.svg" alt="Logo" width={80} height={80} />
            </div>
          </div>

          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />

          <h2 className="text-xl font-bold text-primary">{loadingMessage}</h2>

          <p className="mt-2 text-muted-foreground text-sm max-w-xs text-center">
            {t("common.loading_description")}
          </p>
        </div>
      </div>
    </div>
  );
};
