import { useTranslation } from "@/lib/i18n";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("terms.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("terms.lastUpdated")}: 05/31/2025
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.acceptance.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("terms.acceptance.content")}
              </p>
            </section>

            {/* Educational Project Disclaimer */}
            <section className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.educationalProject.title")}
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("terms.educationalProject.content")}
                </p>
                <p className="text-muted-foreground">
                  {t("terms.educationalProject.academicPurpose")}
                </p>
                <p className="text-muted-foreground">
                  {" "}
                  {t("terms.educationalProject.limitations")}
                </p>
                <p className="text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                  {" "}
                  {t("terms.educationalProject.byuiInfo")}
                </p>
              </div>
            </section>

            {/* Content Attribution and Intellectual Property */}
            <section className="bg-muted/50 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.intellectualProperty.title")}
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("terms.intellectualProperty.churchContent")}
                </p>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t("terms.intellectualProperty.restrictions.title")}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>
                      {t("terms.intellectualProperty.restrictions.commercial")}
                    </li>
                    <li>
                      {t(
                        "terms.intellectualProperty.restrictions.modification"
                      )}
                    </li>
                    <li>
                      {t(
                        "terms.intellectualProperty.restrictions.redistribution"
                      )}
                    </li>
                    <li>
                      {t("terms.intellectualProperty.restrictions.attribution")}
                    </li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  {t("terms.intellectualProperty.platformCode")}
                </p>
              </div>
            </section>

            {/* Use of Services */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.useOfServices.title")}
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("terms.useOfServices.content")}
                </p>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t("terms.useOfServices.prohibited.title")}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>{t("terms.useOfServices.prohibited.illegal")}</li>
                    <li>{t("terms.useOfServices.prohibited.harmful")}</li>
                    <li>{t("terms.useOfServices.prohibited.impersonate")}</li>
                    <li>{t("terms.useOfServices.prohibited.interfere")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.userContent.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.userContent.responsibility")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.userContent.license")}
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.disclaimer.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.disclaimer.content")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.disclaimer.churchEndorsement")}
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.limitation.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("terms.limitation.content")}
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.termination.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("terms.termination.content")}
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.changes.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("terms.changes.content")}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("terms.contact.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("terms.contact.content")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
