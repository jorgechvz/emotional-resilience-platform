import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { Link } from "react-router-dom";

export const ErrorState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">{t("courses.notFound")}</h1>
      <p className="mb-6">{t("courses.notFoundDesc")}</p>
      <Link to="/courses">
        <Button>{t("courses.browseAll")}</Button>
      </Link>
    </div>
  );
};