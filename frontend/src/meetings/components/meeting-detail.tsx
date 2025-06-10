import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Heart,
  Navigation,
  Star,
  Video,
  ChevronUp,
  Home,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type {
  ResilienceCircle,
  CircleType,
} from "../types/resilience-circles.types";
import useResilienceCircles from "../hooks/use-resilience-circles";
import { toast } from "sonner";
import { useAuthStore } from "@/auth/context/use-auth-store";
import { useTranslation } from "@/lib/i18n"; // Importamos el hook de traducción

interface MeetingDetailsProps {
  meeting: ResilienceCircle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function MeetingDetails({
  meeting,
  isFavorite,
  onToggleFavorite,
}: MeetingDetailsProps) {
  const { fetchEnrollUserInCircle, fetchCancelEnrollment } =
    useResilienceCircles(meeting.id);
  const currentUser = useAuthStore((state) => state.user);
  const { t } = useTranslation(); // Obtenemos la función de traducción

  const handleRegister = async () => {
    const promise = fetchEnrollUserInCircle.mutateAsync({
      circleId: meeting.id,
      status: "CONFIRMED",
    });
    toast.promise(promise, {
      loading: t("groups.details.registering"),
      success: "Successfully registered!",
      error: "Failed to register. Please try again.",
      richColors: true,
    });
  };

  const isEnrolled = meeting.enrolledUsers?.some(
    (enrollment) =>
      enrollment.user.id === currentUser?.id &&
      enrollment.status === "CONFIRMED"
  );

  const handleCancelEnrollment = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to cancel enrollment.");
      return;
    }
    const enrollment = meeting.enrolledUsers?.find(
      (enrollment) => enrollment.user.id === currentUser.id
    );
    const promise = fetchCancelEnrollment.mutateAsync(enrollment?.id || "");
    toast.promise(promise, {
      loading: t("groups.details.cancelling"),
      success: "Enrollment cancelled successfully.",
      error: "Failed to cancel enrollment. Please try again.",
      richColors: true,
    });
  };
  const reviews = [
    {
      id: 1,
      name: "Alex Thompson",
      avatar: "https://placehold.co/600x400.png",
      rating: 5,
      date: "2 weeks ago",
      content:
        "This group has been transformative for me. The facilitator creates such a safe space, and I've learned practical techniques that help me every day.",
    },
    {
      id: 2,
      name: "Sarah Miller",
      avatar: "https://placehold.co/600x400.png",
      rating: 4,
      date: "1 month ago",
      content:
        "A very supportive environment. I appreciate the structured approach and the kindness of everyone involved. Highly recommend for anyone looking to build emotional strength.",
    },
  ];

  const upcomingSessions = [
    {
      id: "session1",
      date: "Tuesday, June 11",
      time: "6:00 PM - 7:30 PM",
      topic: "Building Daily Resilience Practices",
      isFull: false,
    },
    {
      id: "session2",
      date: "Tuesday, June 18",
      time: "6:00 PM - 7:30 PM",
      topic: "Mindfulness and Stress Reduction Techniques",
      isFull: true,
    },
    {
      id: "session3",
      date: "Tuesday, June 25",
      time: "6:00 PM - 7:30 PM",
      topic: "Cultivating Positive Self-Talk",
      isFull: false,
    },
  ];

  // Mock similar groups - mantener por ahora
  const similarGroups = [
    {
      id: "similar101",
      name: "Mindfulness for Beginners",
      focus: "Mindfulness",
      distance: 1.5,
      type: "VIRTUAL" as CircleType,
      imageUrl: "https://placehold.co/600x400.png",
      participants: 8,
      maxParticipants: 15,
    },
    {
      id: "similar102",
      name: "Stress Management Workshop",
      focus: "Anxiety Management",
      distance: 3.2,
      type: "IN_PERSON" as CircleType,
      imageUrl: "https://placehold.co/600x400.png",
      participants: 12,
      maxParticipants: 20,
    },
  ];

  return (
    <>
      <DialogHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={meeting.type === "VIRTUAL" ? "secondary" : "default"}
              className="py-1 px-2.5"
            >
              {meeting.type === "VIRTUAL" ? (
                <Video className="h-4 w-4 mr-1.5" />
              ) : (
                <Home className="h-4 w-4 mr-1.5" />
              )}
              <span className="capitalize text-xs font-medium">
                {meeting.type.toLowerCase().replace("_", "-")}
              </span>
            </Badge>
            {meeting.featured && (
              <Badge
                variant="outline"
                className="bg-golden-50 text-golden-700 border-golden-200 py-1 px-2.5"
              >
                <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />{" "}
                <span className="text-xs font-medium">
                  {t("groups.card.featured")}
                </span>
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={`h-9 w-9 rounded-full ${
              isFavorite
                ? "text-coral-500 hover:bg-coral-50"
                : "text-neutral-400 hover:bg-neutral-100"
            }`}
            onClick={onToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
        <DialogTitle className="text-3xl font-bold text-neutral-800">
          {meeting.name}
        </DialogTitle>
        <DialogDescription className="text-lg text-neutral-600 pt-1">
          {meeting.focus}
        </DialogDescription>
      </DialogHeader>

      {/* Hero Image */}
      <div className="relative h-56 md:h-72 rounded-lg overflow-hidden my-6 shadow-lg">
        <img
          src={meeting.imageUrl || "https://placehold.co/1440x600.png"}
          alt={meeting.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            {meeting.rating && (
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow">
                <Star className="h-5 w-5 text-golden-400 fill-current" />
                <span className="text-sm font-semibold text-neutral-800">
                  {meeting.rating.toFixed(1)}
                </span>
              </div>
            )}
            {typeof meeting.distance === "number" && (
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm shadow flex items-center text-neutral-700">
                <Navigation className="h-4 w-4 inline mr-1.5" />
                {meeting.distance.toFixed(1)} miles away
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="details">
            {t("groups.details.tabs.details")}
          </TabsTrigger>
          <TabsTrigger value="schedule">
            {t("groups.details.tabs.schedule")}
          </TabsTrigger>
          <TabsTrigger value="reviews">
            {t("groups.details.tabs.reviews")} ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="similar">
            {t("groups.details.tabs.similar")}
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("groups.details.aboutGroup")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-700 leading-relaxed">
                  {meeting.description || t("groups.details.noDescription")}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("groups.details.whatToExpect")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-neutral-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-1" />
                      <span>{t("groups.details.expectItems.discussions")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-1" />
                      <span>{t("groups.details.expectItems.exercises")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-1" />
                      <span>{t("groups.details.expectItems.environment")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-1" />
                      <span>{t("groups.details.expectItems.connections")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("groups.details.focusAreas")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {meeting.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="py-1 px-2.5 text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {(!meeting.tags || meeting.tags.length === 0) && (
                      <p className="text-neutral-600">
                        {t("groups.details.noFocusAreas")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">
                    {t("groups.details.meetingInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-sage-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-neutral-800">
                        {meeting.location}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {meeting.address}
                      </p>
                      {meeting.type === "IN_PERSON" && (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-sage-600 hover:text-sage-700 mt-1"
                        >
                          {t("groups.details.getDirections")}
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-sage-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-neutral-800">
                        {t("groups.details.schedule")}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {meeting.dateDescription}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {meeting.timeDescription}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-sage-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-neutral-800">
                        {t("groups.details.participants")}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {meeting.enrolledUsers?.length}{" "}
                        {t("groups.details.spotsFilled")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-lavender-100 text-lavender-700 text-base">
                        {meeting.facilitator
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-neutral-800">
                        {t("groups.details.facilitator")}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {meeting.facilitator}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <p className="text-center text-xs text-neutral-500 px-4">
                {t("groups.details.registrationNote")}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t("groups.details.upcomingSessions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="bg-white hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="bg-sage-100 text-sage-700 rounded-lg p-3 text-center min-w-[70px]">
                          <div className="text-sm uppercase font-semibold">
                            {session.date.split(",")[0].substring(0, 3)}
                          </div>
                          <div className="text-2xl font-bold">
                            {session.date.split(" ")[1]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-800">
                            {session.topic}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.time}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={session.isFull}
                          className="mt-2 sm:mt-0"
                        >
                          {session.isFull
                            ? t("groups.details.sessionFull")
                            : t("groups.details.addToCalendar")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">
                  {t("groups.details.noSessions")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6 pt-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="text-xl">
                  {t("groups.details.participantReviews")}
                </CardTitle>
                <Button variant="outline">
                  {t("groups.details.writeReview")}
                </Button>
              </div>
              {meeting.rating && reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-3xl font-bold text-neutral-800">
                    {meeting.rating.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(meeting.rating!)
                              ? "text-golden-400 fill-current"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500">
                      {t("groups.details.basedOnReviews")}
                    </span>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-coral-100 text-coral-700">
                            {review.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-neutral-800">
                              {review.name}
                            </h4>
                            <span className="text-xs text-neutral-500">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-golden-400 fill-current"
                                    : "text-neutral-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-700 mt-3 ml-13 leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">
                  {t("groups.details.noReviews")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="similar" className="space-y-6 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t("groups.details.similarGroups")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {similarGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <img
                          src={
                            group.imageUrl || "https://placehold.co/600x400.png"
                          }
                          alt={group.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-800 mb-1">
                            {group.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mb-1">
                            {group.focus}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
                            {group.type === "VIRTUAL" ? (
                              <Video className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {group.type.toLowerCase().replace("_", "-")}
                            </span>
                            {group.type === "IN_PERSON" && (
                              <span>· {group.distance} miles</span>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs py-0.5 px-1.5"
                          >
                            {group.participants}/{group.maxParticipants}{" "}
                            {t("groups.details.spots")}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="self-start"
                        >
                          <ChevronUp className="h-4 w-4 rotate-90" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">
                  {t("groups.details.noSimilarGroups")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-8 pt-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
        <Button size="lg" variant="outline" className="cursor-pointer">
          {t("groups.details.contactFacilitator")}
        </Button>
        {isEnrolled ? (
          <Button
            size="lg"
            variant="secondary"
            className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            onClick={handleCancelEnrollment}
            disabled={fetchCancelEnrollment.isPending}
          >
            {fetchCancelEnrollment.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("groups.details.cancelling")}
              </>
            ) : (
              <>{t("groups.details.cancelEnrollment")}</>
            )}
          </Button>
        ) : (
          <Button
            size="lg"
            className="cursor-pointer bg-gradient-to-r from-chart-2 to-chart-3 hover:from-primary/70 hover:to-primary text-white"
            onClick={handleRegister}
            disabled={fetchEnrollUserInCircle.isPending}
          >
            {fetchEnrollUserInCircle.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("groups.details.registering")}
              </>
            ) : (
              <>{t("groups.details.register")}</>
            )}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
