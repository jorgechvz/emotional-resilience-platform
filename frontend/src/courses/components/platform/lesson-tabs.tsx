import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n";
import { ContentTab } from "./tabs/content-tab";
import { NotesTab } from "./tabs/notes-tab";
import { DiscussionTab } from "./tabs/discussion-tab";

export const LessonTabs = () => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="content">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">{t("courses.tabs.content")}</TabsTrigger>
        <TabsTrigger value="notes">{t("courses.tabs.notes")}</TabsTrigger>
        <TabsTrigger value="discussion">
          {t("courses.tabs.discussion")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <ContentTab />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab />
      </TabsContent>
      <TabsContent value="discussion">
        <DiscussionTab />
      </TabsContent>
    </Tabs>
  );
};
