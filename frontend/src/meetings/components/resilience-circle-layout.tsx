import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  Zap,
  BookOpen,
  Filter,
  SearchIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Grid2X2Icon,
  ListIcon,
  MessageCircleWarning,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useResilienceCircles from "../hooks/use-resilience-circles";
import type {
  ResilienceCircle,
  CircleType,
} from "../types/resilience-circles.types";
import MeetingCard from "./meeting-card";
import { LoadingState } from "@/courses/components/platform/state/loading-state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ResilienceMap from "./resilience-map";
import { useTranslation } from "@/lib/i18n";

const FOCUS_AREAS = [
  "All Focus Areas",
  "General Resilience",
  "Grief & Loss",
  "Mindfulness",
  "Workplace Resilience",
  "Family Resilience",
  "Life Transitions",
  "Anxiety Management",
  "Depression Support",
];

const LoadingPlaceholder = () => <LoadingState />;

// Componente de Error Simple
const ErrorPlaceholder = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
    <Zap className="h-12 w-12 text-destructive mb-4" />{" "}
    <p className="text-lg text-destructive-foreground mb-2">
      Oops! Something went wrong.
    </p>
    <p className="text-muted-foreground">
      {message || "Could not load resilience circles. Please try again later."}
    </p>
  </div>
);

export default function ResilienceCircleLayout() {
  const { t } = useTranslation();
  const { fetchAllResilienceCircles } = useResilienceCircles();
  const {
    data: resilienceCirclesData,
    isLoading,
    isError,
  } = fetchAllResilienceCircles;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeetings, setFilteredMeetings] = useState<ResilienceCircle[]>(
    []
  );
  const [selectedMeeting, setSelectedMeeting] =
    useState<ResilienceCircle | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: "all" as "all" | CircleType,
    focus: "All Focus Areas",
  });
  const [isGrid, setIsGrid] = useState(true);
  const [isList, setIsList] = useState(false);

  const toggleViewMode = () => {
    setIsGrid((prev) => !prev);
    setIsList(false);
  };

  const toggleListView = () => {
    setIsList((prev) => !prev);
    setIsGrid(false);
  };

  useEffect(() => {
    if (resilienceCirclesData) {
      let processedMeetings = [...resilienceCirclesData];

      processedMeetings = processedMeetings.filter((meeting) => {
        const matchesSearch =
          meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.facilitator.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          filters.type === "all" || meeting.type === filters.type;
        const matchesFocus =
          filters.focus === "All Focus Areas" ||
          meeting.focus === filters.focus;

        return matchesSearch && matchesType && matchesFocus;
      });

      setFilteredMeetings(processedMeetings);
    } else {
      setFilteredMeetings([]);
    }
  }, [searchTerm, filters, resilienceCirclesData]);

  const toggleFavorite = (meetingId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(meetingId)) {
      newFavorites.delete(meetingId);
    } else {
      newFavorites.add(meetingId);
    }
    setFavorites(newFavorites);
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      focus: "All Focus Areas",
    });
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50">
        <div className="container py-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary/70 mb-6">
              <MapPin className="h-4 w-4" />
              {t("groups.pageTitle.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("groups.pageTitle.title")}
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t("groups.pageTitle.subtitle")}
            </p>
          </div>
          <LoadingPlaceholder />
        </div>
      </div>
    );
  }

  if (isError || !resilienceCirclesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50">
        <div className="container py-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary/70 mb-6">
              <MapPin className="h-4 w-4" />
              {t("groups.pageTitle.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("groups.pageTitle.title")}
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t("groups.pageTitle.subtitle")}
            </p>
          </div>
          <ErrorPlaceholder />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-8 bg-gradient-to-br from-sage-50 via-white to-lavender-50">
      <div className="container py-10 mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary/70 mb-6">
            <MapPin className="h-4 w-4" />
            {t("groups.pageTitle.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t("groups.pageTitle.title")}
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t("groups.pageTitle.subtitle")}
          </p>
          <div className="mt-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-3 max-w-3xl mx-auto">
            <div className="flex items-center">
              <MessageCircleWarning className="h-10 w-10" />
              <p className="text-sm">{t("groups.pageTitle.disclaimer")}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search by location, group name, focus area, or facilitator..."
              className="pl-8 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm  focus:border-sage-400 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm  shadow-lg hover:bg-white/90 text-neutral-700 h-11 w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4 text-sage-600" />{" "}
                {t("groups.search.filters")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4 space-y-4 bg-white/95 backdrop-blur-md  shadow-xl">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-700">
                  {t("groups.search.meetingType")}
                </Label>
                <Tabs
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: value as "all" | CircleType,
                    }))
                  }
                >
                  <TabsList className="grid w-full grid-cols-3 h-9">
                    <TabsTrigger value="all" className="text-xs">
                      {t("groups.meetingTypes.all")}
                    </TabsTrigger>
                    <TabsTrigger value="IN_PERSON" className="text-xs">
                      {t("groups.meetingTypes.inPerson")}
                    </TabsTrigger>
                    <TabsTrigger value="VIRTUAL" className="text-xs">
                      {t("groups.meetingTypes.virtual")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <hr className="border-sage-100" />

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-700">
                  {t("groups.search.focusArea")}
                </Label>
                <Select
                  value={filters.focus}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, focus: value }))
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOCUS_AREAS.map((area) => (
                      <SelectItem key={area} value={area} className="text-xs">
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-3/5 order-2 xl:order-1">
            <Card className="h-[600px] bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden sticky top-4">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-gradient-to-br from-sage-100 via-lavender-100 to-coral-100">
                  <ResilienceMap
                    circles={filteredMeetings}
                    selectedId={selectedMeeting?.id ?? null}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full xl:w-2/5 order-1 xl:order-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {filteredMeetings.length}{" "}
                {filteredMeetings.length === 1
                  ? t("groups.results.groupsFound")
                  : t("groups.results.groupsFound_plural")}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="List view"
                  onClick={toggleListView}
                >
                  <span className="sr-only">
                    {t("groups.results.listView")}
                  </span>
                  <ListIcon size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Grid view"
                  onClick={toggleViewMode}
                >
                  <span className="sr-only">
                    {t("groups.results.gridView")}
                  </span>
                  <Grid2X2Icon size={16} />
                </Button>
              </div>
            </div>

            {filteredMeetings.length > 0 ? (
              <>
                <div className="h-[500px] overflow-y-auto pr-2 space-y-4 mb-4">
                  {isList && (
                    <div className="space-y-4">
                      {filteredMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          isFavorite={favorites.has(meeting.id)}
                          onToggleFavorite={() => toggleFavorite(meeting.id)}
                          isSelected={selectedMeeting?.id === meeting.id}
                          onSelect={() => setSelectedMeeting(meeting)}
                        />
                      ))}
                    </div>
                  )}

                  {isGrid && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          isFavorite={favorites.has(meeting.id)}
                          onToggleFavorite={() => toggleFavorite(meeting.id)}
                          isSelected={selectedMeeting?.id === meeting.id}
                          onSelect={() => setSelectedMeeting(meeting)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {filteredMeetings.length > 10 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeftIcon size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-primary text-white"
                      >
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <Button variant="outline" size="sm">
                        <ChevronRightIcon size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              !isLoading && (
                <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
                  <div className="text-neutral-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">
                    {t("groups.results.noGroups")}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {t("groups.results.tryAdjusting")}
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    {t("groups.results.resetFilters")}
                  </Button>
                </Card>
              )
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/50 via-primary/50 to-chart-3 border-0 text-white overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">
                  {t("groups.callToAction.title")}
                </h2>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                  {t("groups.callToAction.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-neutral-100"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    {t("groups.callToAction.startGroup")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-primary hover:bg-neutral-100"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    {t("groups.callToAction.leaderResources")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
