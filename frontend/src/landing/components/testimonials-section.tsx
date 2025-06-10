import { useTranslation } from "@/lib/i18n";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full py-16 md:py-24 bg-card/50 backdrop-blur-sm flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-chart-3/10 px-4 py-2 text-sm font-medium text-chart-3 mb-6">
            <Star className="h-4 w-4" />
            {t("home.transformationStories.title")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.transformationStories.title-2")}{" "}
            <span className="text-chart-3">{t("home.transformationStories.title-3")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.transformationStories.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-chart-5 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{t("home.transformationStories.testimonial1.quote")}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  MJ
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-card-foreground">
                    {t("home.transformationStories.testimonial1.author")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("home.transformationStories.testimonial1.category")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-2 to-chart-3 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-chart-5 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{t("home.transformationStories.testimonial2.quote")}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-2 to-chart-3 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  SR
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-card-foreground">
                    {t("home.transformationStories.testimonial2.author")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("home.transformationStories.testimonial2.category")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-chart-3 to-chart-4 rounded-3xl opacity-0"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-chart-5 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{t("home.transformationStories.testimonial3.quote")}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-3 to-chart-4 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  DT
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-card-foreground">
                    {t("home.transformationStories.testimonial3.author")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("home.transformationStories.testimonial3.category")}
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