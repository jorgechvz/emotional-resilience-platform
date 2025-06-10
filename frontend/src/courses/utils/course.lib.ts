import type { ChapterEntityType } from "../types/courses.types";

export const getLanguage = (): "en" | "es" | "qu" | "ay" => {
  if (typeof window === "undefined") return "en";
  const savedLanguage = localStorage.getItem("language") as
    | "en"
    | "es"
    | "qu"
    | "ay";
  return savedLanguage && ["en", "es", "qu", "ay"].includes(savedLanguage)
    ? savedLanguage
    : "en";
};

export const getDuration = (chapters: ChapterEntityType[]) => {
  if (!chapters || chapters.length === 0) return "0";
  const totalDuration = chapters.reduce(
    (acc: any, chapter: ChapterEntityType) => {
      return acc + (chapter.duration || 0);
    },
    0
  );
  return Math.ceil(totalDuration / 60);
};


export const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};