import { useCourseContext } from "@/courses/context/course-context";
import { useTranslation } from "@/lib/i18n";
import { Video, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { Button } from "@/components/ui/button";

export const ContentTab = () => {
  const { t } = useTranslation();
  const { currentChapter } = useCourseContext();
  const [videoError, setVideoError] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const videoUrls = currentChapter?.videoUrls || [];
  const hasVideos = videoUrls.length > 0;

  const activeVideoUrl = hasVideos ? videoUrls[activeVideoIndex] : "";

  const isYouTubeUrl =
    activeVideoUrl &&
    (activeVideoUrl.includes("youtube.com") ||
      activeVideoUrl.includes("youtu.be"));

  useEffect(() => {
    setActiveVideoIndex(0);
    setVideoError(false);
  }, [currentChapter?.id]);

  const goToNextVideo = () => {
    if (activeVideoIndex < videoUrls.length - 1) {
      setActiveVideoIndex((prevIndex) => prevIndex + 1);
      setVideoError(false);
    }
  };

  const goToPrevVideo = () => {
    if (activeVideoIndex > 0) {
      setActiveVideoIndex((prevIndex) => prevIndex - 1);
      setVideoError(false);
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null;

    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") ?? "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }

    return null;
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2">
        {hasVideos && !videoError ? (
          isYouTubeUrl ? (
            <ReactPlayer
              url={activeVideoUrl}
              width="100%"
              height="100%"
              controls={true}
              onError={() => setVideoError(true)}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                  },
                },
              }}
            />
          ) : (
            <video
              className="w-full h-full rounded-lg"
              src={activeVideoUrl}
              controls
              playsInline
              onError={() => setVideoError(true)}
              poster="/video-poster.jpg"
            />
          )
        ) : (
          <div className="text-center p-6">
            {hasVideos && videoError ? (
              <>
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  {t("courses.videoError")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("courses.videoErrorMessage")}
                </p>
              </>
            ) : (
              <>
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  {t("courses.lessonContent")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("courses.contentPlaceholder")}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {videoUrls.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevVideo}
            disabled={activeVideoIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("courses.previousVideo")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextVideo}
            disabled={activeVideoIndex === videoUrls.length - 1}
          >
            {t("courses.nextVideo")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {videoUrls.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {videoUrls.map((url, index) => {
            const isYouTube =
              url.includes("youtube.com") || url.includes("youtu.be");
            const thumbnailUrl = isYouTube ? getYouTubeThumbnail(url) : null;

            return (
              <div
                key={index}
                className={`
                  aspect-video rounded-md overflow-hidden cursor-pointer border-2
                  ${
                    index === activeVideoIndex
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent"
                  }
                  hover:opacity-90 transition-all
                `}
                onClick={() => {
                  setActiveVideoIndex(index);
                  setVideoError(false);
                }}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={`Video ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Video className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Contenido HTML */}
      {currentChapter?.content ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: currentChapter.content,
          }}
        />
      ) : (
        <div className="prose max-w-none">
          <h2>
            {t("courses.understanding")} {currentChapter?.title}
          </h2>
          <p>
            {t("courses.lessonExplores")} {currentChapter?.title?.toLowerCase()}{" "}
            {t("courses.andApplication")}
          </p>
          <h3>{t("courses.keyTakeaways")}</h3>
          <ul>
            <li>{t("courses.takeaway1")}</li>
            <li>{t("courses.takeaway2")}</li>
            <li>{t("courses.takeaway3")}</li>
            <li>{t("courses.takeaway4")}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
