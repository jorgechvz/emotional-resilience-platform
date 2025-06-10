import { BookOpen, Users, ArrowRight, Heart, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="w-full py-16 md:py-24 bg-card/50 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground mb-6">
            <Zap className="h-4 w-4" />
            {t("home.features.badge")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.features.title")}{" "}
            <span className="text-chart-1">{t("home.features.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-chart-1/10 rounded-2xl w-fit mb-6">
                <BookOpen className="h-8 w-8 text-chart-1" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">
                {t("home.features.feature1.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("home.features.feature1.description")}
              </p>
              <div className="flex items-center text-chart-1 font-medium">
                <span>{t("home.features.feature1.cta")}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-2 to-chart-3 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-chart-2/10 rounded-2xl w-fit mb-6">
                <Users className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">
                {t("home.features.feature2.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("home.features.feature2.description")}
              </p>
              <div className="flex items-center text-chart-2 font-medium">
                <span>{t("home.features.feature2.cta")}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-3 to-chart-4 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-chart-3/10 rounded-2xl w-fit mb-6">
                <Heart className="h-8 w-8 text-chart-3" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">
                {t("home.features.feature3.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("home.features.feature3.description")}
              </p>
              <div className="flex items-center text-chart-3 font-medium">
                <span>{t("home.features.feature3.cta")}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}