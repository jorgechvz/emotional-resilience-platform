import { CheckCircle, Circle, FileText, Video } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { ChapterEntityType } from "@/courses/types/courses.types";

interface ChapterItemProps {
  chapter: ChapterEntityType;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  isActive,
  isCompleted,
  onClick,
}) => {
  const { t } = useTranslation();
  const hasVideo = chapter.videoUrls && chapter.videoUrls.length > 0;

  return (
    <li
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-gray-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </div>
        <div>
          <p className={`font-medium ${isActive ? "text-primary" : ""}`}>
            {chapter.title}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {hasVideo ? (
              <Video className="h-3 w-3 mr-1" />
            ) : (
              <FileText className="h-3 w-3 mr-1" />
            )}
            {Math.round((chapter.duration || 0) / 60)} {t("courses.minutes")}
          </div>
        </div>
      </div>
    </li>
  );
};
