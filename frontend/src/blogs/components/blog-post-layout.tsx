import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Heart,
  Share2,
  Check,
  Search,
  X,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import useBlogPost from "../hooks/use-blog-post";
import { getTimeAgo } from "@/courses/utils/course.lib";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n";

export default function BlogPostLayout() {
  const { t } = useTranslation();
  const { getAllBlogPosts } = useBlogPost();
  const { data: stories = [] } = getAllBlogPosts;
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [isFiltering, setIsFiltering] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    stories?.forEach((story) => {
      story.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!stories) return [];

    let result = [...stories];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (story) =>
          story.title.toLowerCase().includes(term) ||
          story.content.toLowerCase().includes(term)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((story) =>
        selectedTags.some((tag) => story.tags?.includes(tag))
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "popular":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }

    return result;
  }, [stories, searchTerm, selectedTags, sortBy]);

  useEffect(() => {
    setIsFiltering(searchTerm.trim() !== "" || selectedTags.length > 0);
  }, [searchTerm, selectedTags]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleShare = (id: string, title: string) => {
    const url = `${window.location.origin}/blog/${id}`;

    if (navigator.share) {
      navigator
        .share({
          text: t("blogs.share.shareText"),
          title: title,
          url: url,
        })
        .catch((err) => console.error("Error sharing", err));
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied({ ...copied, [id]: true });
          setTimeout(
            () => setCopied((prev) => ({ ...prev, [id]: false })),
            2000
          );
        })
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  return (
    <div className="container py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("blogs.title")}
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t("blogs.subtitle")}
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/platform/stories/new">
            <Button>{t("blogs.actions.shareStory")}</Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t("blogs.search.placeholder")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("blogs.sort.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("blogs.sort.newest")}</SelectItem>
              <SelectItem value="oldest">{t("blogs.sort.oldest")}</SelectItem>
              <SelectItem value="popular">{t("blogs.sort.popular")}</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t("blogs.filter.byTags")}
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                {t("blogs.filter.selectTags")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isFiltering && (
            <Button variant="ghost" onClick={clearFilters}>
              {t("blogs.filter.clearFilters")}
            </Button>
          )}
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button onClick={() => toggleTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>
                  {t("blogs.card.posted")} {getTimeAgo(story.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div
                  className="prose max-w-none line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: story.content,
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {story.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        if (!selectedTags.includes(tag)) {
                          setSelectedTags((prev) => [...prev, tag]);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {story._count?.comments || 0}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Heart className="h-4 w-4 mr-1" />
                    {story.likes || 0}
                  </div>
                  <div
                    className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleShare(story.id, story.title)}
                  >
                    {copied[story.id] ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                        {t("blogs.share.copied")}
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-1" />
                        {t("blogs.share.action")}
                      </>
                    )}
                  </div>
                </div>
                <Link to={`/stories/${story.id}`}>
                  <Button variant="ghost" size="sm">
                    {t("blogs.card.readMore")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">
            {t("blogs.emptyState.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("blogs.emptyState.description")}
          </p>
          <Button onClick={clearFilters}>
            {t("blogs.emptyState.clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
