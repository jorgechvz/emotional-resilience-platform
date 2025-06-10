import { useTranslation } from "@/lib/i18n";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("privacy.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("privacy.lastUpdated")}: 05/31/2025
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.introduction.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.introduction.content")}
              </p>
            </section>

            {/* Educational Project Notice */}
            <section className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.educationalProject.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.educationalProject.content")}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.educationalProject.points.course")}</li>
                <li>{t("privacy.educationalProject.points.institution")}</li>
                <li>{t("privacy.educationalProject.points.purpose")}</li>
                <li>{t("privacy.educationalProject.points.academic")}</li>
              </ul>
            </section>

            {/* Content Attribution */}
            <section className="bg-muted/50 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.contentAttribution.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.contentAttribution.content")}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.contentAttribution.point1")}</li>
                <li>{t("privacy.contentAttribution.point2")}</li>
                <li>{t("privacy.contentAttribution.point3")}</li>
              </ul>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.informationCollected.title")}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t("privacy.informationCollected.personal.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("privacy.informationCollected.personal.content")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t("privacy.informationCollected.usage.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("privacy.informationCollected.usage.content")}
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.howWeUse.title")}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.howWeUse.point1")}</li>
                <li>{t("privacy.howWeUse.point2")}</li>
                <li>{t("privacy.howWeUse.point3")}</li>
                <li>{t("privacy.howWeUse.point4")}</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.dataSharing.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.dataSharing.content")}
              </p>
              <p className="text-muted-foreground">
                {t("privacy.dataSharing.churchData")}
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.yourRights.title")}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.yourRights.access")}</li>
                <li>{t("privacy.yourRights.correct")}</li>
                <li>{t("privacy.yourRights.delete")}</li>
                <li>{t("privacy.yourRights.portability")}</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("privacy.contact.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("privacy.contact.content")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}