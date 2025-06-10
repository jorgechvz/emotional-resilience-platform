import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Heart,
  Star,
  Video,
  Home,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n"; // Import useTranslation hook

import type {
  ResilienceCircle,
  CircleType,
} from "../types/resilience-circles.types";
import MeetingDetails from "./meeting-detail";

interface MeetingCardProps {
  meeting: ResilienceCircle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MeetingCard({
  meeting,
  isFavorite,
  onToggleFavorite,
  isSelected,
  onSelect,
}: MeetingCardProps) {
  const { t } = useTranslation(); // Get translation function
  const participantsCount =
    meeting.confirmedParticipantsCount || meeting.participants || 0;

  const getTypeIcon = (type: CircleType) =>
    type === "VIRTUAL" ? (
      <Video className="h-4 w-4" />
    ) : (
      <Home className="h-4 w-4" />
    );

  const availabilityColor = (() => {
    if (!meeting.maxParticipants) return "text-neutral-600";
    const ratio = participantsCount / meeting.maxParticipants;
    if (ratio >= 1) return "text-coral-600";
    if (ratio >= 0.8) return "text-golden-600";
    return "text-sage-600";
  })();

  return (
    <Card
      onClick={onSelect}
      className={`
        relative cursor-pointer overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md transition-shadow duration-300 hover:shadow-xl
        ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
      `}
    >
      {meeting.featured && (
        <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-r from-primary to-chart-3 py-1 text-center text-[11px] font-medium uppercase tracking-wide text-white">
          ⭐ {t("groups.card.featured")}
        </div>
      )}

      <CardContent className="p-0">
        <div className="aspect-[3/2] relative">
          <img
            src={meeting.imageUrl || "https://placehold.co/600x400.png"}
            alt={meeting.name}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <Button
              size="icon"
              variant="ghost"
              className={`
                h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm
                text-neutral-400 hover:bg-white
                ${isFavorite && "text-coral-500"}
              `}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-current" : "fill-transparent"
                }`}
              />
            </Button>

            <Badge
              variant={meeting.type === "VIRTUAL" ? "secondary" : "default"}
              className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-black"
            >
              {getTypeIcon(meeting.type)}
              <span className="capitalize">
                {meeting.type.toLowerCase().replace("_", "-")}
              </span>
            </Badge>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <header>
            <h3 className="font-semibold text-neutral-800">{meeting.name}</h3>
            <p className="text-sm text-neutral-600">{meeting.focus}</p>
          </header>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-neutral-700">
              {meeting.rating && (
                <>
                  <Star className="h-4 w-4 fill-current text-golden-400" />
                  <span className="font-medium">
                    {meeting.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            {typeof meeting.distance === "number" && (
              <span className="text-neutral-500">
                {meeting.distance.toFixed(1)} mi
              </span>
            )}
          </div>

          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <span>
                <span className="font-medium text-neutral-800">
                  {meeting.location}
                </span>
                <br />
                {meeting.address}
              </span>
            </li>
            <li className="flex gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              {meeting.dateDescription}
            </li>
            <li className="flex gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              {meeting.timeDescription}
            </li>
            <li className="flex gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <span className={`${availabilityColor} font-medium`}>
                {participantsCount}/{meeting.maxParticipants} {t("groups.card.participants")}
              </span>
            </li>
          </ul>

          <p className="line-clamp-2 text-sm text-neutral-600">
            {meeting.description}
          </p>

          {meeting.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {meeting.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
            <span className="text-xs text-neutral-500">
              {t("groups.card.ledBy")} {meeting.facilitator}
            </span>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("groups.card.viewDetails")}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-5xl max-h-[90vh] w-full md:min-w-3xl lg:min-w-5xl overflow-y-auto HideScrollbar">
                <MeetingDetails
                  meeting={meeting}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}