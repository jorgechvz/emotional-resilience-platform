import {
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Heart,
  Circle,
  Triangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { Meteors } from "@/components/ui/meteors";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-10 flex items-center justify-center overflow-hidden">
      <Meteors number={50} />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-20 text-chart-1/40 "
          style={{ animationDelay: "1s" }}
        >
          <Circle className="w-8 h-8" />
        </div>
        <div
          className="absolute top-40 right-32 text-chart-2/40 "
          style={{ animationDelay: "3s" }}
        >
          <Triangle className="w-6 h-6" />
        </div>
        <div
          className="absolute bottom-32 left-40 text-chart-3/40 "
          style={{ animationDelay: "5s" }}
        >
          <Sparkles className="w-10 h-10" />
        </div>
        <div
          className="absolute bottom-20 right-20 text-chart-4/40 "
          style={{ animationDelay: "2s" }}
        >
          <Heart className="w-7 h-7" />
        </div>
      </div>

      <div className="container relative px-4 md:px-6 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-md px-6 py-3 text-sm font-medium text-muted-foreground shadow-xl border border-border mb-10">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            {t("home.hero.badge")}
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
            <span className="block bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
              {t("home.hero.title")}
            </span>
            <span className="block bg-gradient-to-r from-chart-3 via-chart-4 to-chart-1 bg-clip-text text-transparent">
              {t("home.hero.title-2")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("home.hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground shadow-2xl shadow-chart-1/25 transition-all duration-300 hover:shadow-chart-1/40 hover:scale-105 group px-8 py-4 text-lg"
              >
                {t("home.hero.startJourney")}
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/resilience-circles">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border text-foreground hover:bg-muted hover:border-muted-foreground transition-all duration-300 hover:scale-105 px-8 py-4 text-lg bg-card/80 backdrop-blur-sm"
              >
                {t("home.hero.findSupport")}
              </Button>
            </Link>
          </div>

          {/* Visual Elements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Element 1 */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full min-h-[250px] flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-chart-1 to-chart-2 rounded-2xl flex items-center justify-center mb-6 mx-auto flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t("home.hero.element1.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("home.hero.element1.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Element 2 */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-chart-3/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full min-h-[250px] flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-chart-2 to-chart-3 rounded-2xl flex items-center justify-center mb-6 mx-auto flex-shrink-0">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t("home.hero.element2.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("home.hero.element2.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Element 3 */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-3/20 to-chart-4/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full min-h-[250px] flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-chart-3 to-chart-4 rounded-2xl flex items-center justify-center mb-6 mx-auto flex-shrink-0">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t("home.hero.element3.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("home.hero.element3.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
