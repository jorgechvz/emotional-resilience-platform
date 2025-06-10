import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export default function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="w-full py-16 md:py-24 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-chart-3 via-chart-2 to-chart-3"></div>

          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-16 lg:p-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground mb-8">
                <CheckCircle className="h-4 w-4" />
                Join thousands of others
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                {t("home.cta.title")}
              </h2>

              <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                {t("home.cta.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/auth/register">
                  <Button
                    size="lg"
                    className="cursor-pointer bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {t("home.cta.createAccount")}
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="cursor-pointer bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {t("home.cta.exploreCourses")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}