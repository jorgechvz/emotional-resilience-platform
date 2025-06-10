import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorksSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground mb-6 shadow-lg border border-border">
            <Play className="h-4 w-4" />
            {t("home.howItWorks.badge")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.howItWorks.title")}{" "}
            <span className="text-chart-2">{t("home.howItWorks.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.howItWorks.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-chart-1 via-chart-2 to-chart-3 hidden lg:block transform -translate-x-1/2"></div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="lg:order-last mb-8 lg:mb-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-border">
                    <img
                      src="https://www.churchofjesuschrist.org/imgs/8344ebb490a1c6f0f04b5d3574618d74cb0bfada/full/1280%2C/0/default.jpg"
                      alt="Learning courses"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chart-1/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:left-0 lg:right-0 lg:top-1/2 lg:-translate-y-1/2 flex justify-center lg:justify-end mb-6 lg:mb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full text-primary-foreground font-bold text-xl shadow-xl">
                    1
                  </div>
                </div>

                <div className="lg:pr-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("home.howItWorks.step1.title")}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {t("home.howItWorks.step1.description")}
                  </p>
                  <Link to="/courses">
                    <Button
                      variant="outline"
                      className="group border-chart-1 text-chart-1 hover:bg-chart-1/10"
                    >
                      {t("home.howItWorks.step1.cta")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="mb-8 lg:mb-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-chart-3/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-border">
                    <img
                      src="https://www.churchofjesuschrist.org/imgs/c6540e897b677a5d04790d4947c6b1b5130c09a7/full/1280%2C/0/default.jpg"
                      alt="Community support"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chart-2/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:left-0 lg:right-0 lg:top-1/2 lg:-translate-y-1/2 flex justify-center lg:justify-start mb-6 lg:mb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-chart-2 to-chart-3 rounded-full text-primary-foreground font-bold text-xl shadow-xl">
                    2
                  </div>
                </div>

                <div className="lg:pl-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("home.howItWorks.step2.title")}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {t("home.howItWorks.step2.description")}
                  </p>
                  <Link to="/resilience-circles">
                    <Button
                      variant="outline"
                      className="group border-chart-2 text-chart-2 hover:bg-chart-2/10"
                    >
                      {t("home.howItWorks.step2.cta")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="lg:order-last mb-8 lg:mb-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-chart-3/20 to-chart-4/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-border">
                    <img
                      src="https://assets.ldscdn.org/99/5c/995cc034f39f36d9262f5e425c8be206927359b5/pictures_of_jesus_with_a_child.jpeg"
                      alt="Sharing stories"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chart-3/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:left-0 lg:right-0 lg:top-1/2 lg:-translate-y-1/2 flex justify-center lg:justify-end mb-6 lg:mb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-chart-3 to-chart-4 rounded-full text-primary-foreground font-bold text-xl shadow-xl">
                    3
                  </div>
                </div>

                <div className="lg:pr-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("home.howItWorks.step3.title")}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {t("home.howItWorks.step3.description")}
                  </p>
                  <Link to="/stories">
                    <Button
                      variant="outline"
                      className="group border-chart-3 text-chart-3 hover:bg-chart-3/10"
                    >
                      {t("home.howItWorks.step3.cta")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}