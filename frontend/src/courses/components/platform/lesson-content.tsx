import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { LessonHeader } from "./lesson-header";
import { LessonTabs } from "./lesson-tabs";
import { LessonFooter } from "./lesson-footer";

export const LessonContent = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-2/3 lg:w-3/4">
      <Card className="mb-4">
        <CardHeader>
          <LessonHeader />
        </CardHeader>
        <CardContent>
          <LessonTabs />
        </CardContent>
        <CardFooter>
          <LessonFooter />
        </CardFooter>
      </Card>

      <div className="md:flex md:flex-row md:justify-between flex flex-col justify-center items-center space-y-2 md:space-y-0 md:space-x-2">
        <Link to="/courses">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t("courses.backToAll")}
          </Button>
        </Link>
        <Link to="/groups">
          <Button variant="outline">{t("courses.findGroups")}</Button>
        </Link>
      </div>
    </div>
  );
};
