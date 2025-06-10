import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  X,
  Eye,
  Edit3,
  Save,
  ArrowLeft,
  Plus,
  Hash,
  User,
  Calendar,
  Sparkles,
  BookOpen,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import useBlogPost from "../hooks/use-blog-post";
import { useAuthStore } from "@/auth/context/use-auth-store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "./rich-text-editor";
import { useTranslation } from "@/lib/i18n";

interface BlogFormData {
  title: string;
  content: string;
  tags: string[];
  anonymous: boolean;
  category: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  tags?: string;
  form?: string;
  [key: string]: string | undefined;
}

interface BlogPostSubmitData {
  title: string;
  content: string;
  tags: string[];
  author: string | null;
}

const SUGGESTED_TAGS: string[] = [
  "Anxiety",
  "Depression",
  "Grief",
  "Loss",
  "Career",
  "Family",
  "Relationships",
  "Health",
  "Trauma",
  "Recovery",
  "Growth",
  "Mindfulness",
  "Therapy",
  "Support",
  "Healing",
  "Strength",
  "Hope",
  "Change",
  "Transition",
  "Workplace",
];

export default function NewStory() {
  const { t } = useTranslation();
  const { newPostBlog } = useBlogPost();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    tags: [],
    anonymous: true,
    category: "",
  });
  const [tagInput, setTagInput] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (html: string): void => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }));
  };

  const handleAddTag = (tag: string): void => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev: BlogFormData) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("blogs.errors.titleRequired");
    } else if (formData.title.length > 100) {
      newErrors.title = t("blogs.errors.titleTooLong");
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const contentText = tempDiv.textContent || tempDiv.innerText || "";

    if (!contentText.trim()) {
      newErrors.content = "Story content is required";
    } else if (contentText.length > 5000) {
      newErrors.content = "Content must be less than 5000 characters";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = t("blogs.errors.tagsRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | React.MouseEvent
  ): Promise<void> => {
    if (e.type === "submit") {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const blogPostData: BlogPostSubmitData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        author: formData.anonymous
          ? null
          : `${currentUser?.firstName} ${currentUser?.lastName}`,
      };

      const response = await newPostBlog.mutateAsync(blogPostData);

      toast.success(t("blogs.messages.publishSuccess"));
      navigate(`/stories/${response.id}`);
    } catch (error) {
      console.error("Error publishing story:", error);
      toast.error(t("blogs.messages.publishError"));
      setErrors((prev) => ({
        ...prev,
        form: t("blogs.errors.publishFailed"),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWordCount = (): number => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = (): number => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length;
  };

  const getReadingTime = (): number =>
    Math.max(1, Math.ceil(getWordCount() / 200));

  const filteredSuggestions: string[] = SUGGESTED_TAGS.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !formData.tags.includes(tag)
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-6">
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/blog">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.backToStories")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary mt-6">
              {t("blogs.shareYourStory")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("blogs.inspirationMessage")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {t("blogs.createStory")}
                    </CardTitle>
                    <CardDescription>
                      {t("blogs.shareExperience")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-black">
                      {getWordCount()} {t("blogs.words")} • {getReadingTime()}{" "}
                      {t("blogs.minRead")}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Tabs
                value={activeTab}
                onValueChange={(value: string) =>
                  setActiveTab(value as "write" | "preview")
                }
              >
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger
                      value="write"
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      {t("blogs.write")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t("blogs.preview")}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="write" className="p-6 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-medium">
                        {t("blogs.storyTitle")} *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder={t("blogs.titlePlaceholder")}
                        value={formData.title}
                        onChange={handleChange}
                        className={`text-lg py-3 ${
                          errors.title
                            ? "border-destructive focus:border-destructive"
                            : "border-input focus:border-ring"
                        }`}
                      />
                      <div className="flex justify-between items-center">
                        {errors.title && (
                          <p className="text-sm text-destructive">
                            {errors.title}
                          </p>
                        )}
                        <div className="text-xs text-muted ml-auto">
                          {formData.title.length}/100 {t("common.characters")}
                        </div>
                      </div>
                    </div>

                    {/* Content - Rich Text Editor */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="content"
                        className="text-base font-medium"
                      >
                        {t("blogs.yourStory")} *
                      </Label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        placeholder={t("blogs.storyPlaceholder")}
                        error={!!errors.content}
                        className="min-h-[300px]"
                      />
                      <div className="flex justify-between items-center">
                        {errors.content && (
                          <p className="text-sm text-destructive">
                            {errors.content}
                          </p>
                        )}
                        <div className="text-xs text-muted ml-auto">
                          {getCharCount()}/5000 {t("common.characters")}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        {t("blogs.tags")} *{" "}
                        <span className="text-sm font-normal text-muted">
                          ({t("blogs.upToFive")})
                        </span>
                      </Label>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={tagInput}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setTagInput(e.target.value);
                                setShowTagSuggestions(
                                  e.target.value.length > 0
                                );
                              }}
                              onFocus={() =>
                                setShowTagSuggestions(tagInput.length > 0)
                              }
                              placeholder={t("blogs.tagPlaceholder")}
                              disabled={formData.tags.length >= 5}
                              className="border-input focus:border-ring"
                            />
                            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />

                            {/* Tag Suggestions Dropdown */}
                            {showTagSuggestions &&
                              (tagInput.length > 0 ||
                                filteredSuggestions.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                  {filteredSuggestions.length > 0 ? (
                                    filteredSuggestions.map((tag) => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleAddTag(tag)}
                                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b border-border/50 last:border-b-0"
                                      >
                                        <Hash className="h-3 w-3 inline mr-2 text-primary" />
                                        {tag}
                                      </button>
                                    ))
                                  ) : tagInput.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddTag(tagInput.trim())
                                      }
                                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                                    >
                                      <Plus className="h-3 w-3 inline mr-2 text-primary" />
                                      {t("blogs.add")} "{tagInput.trim()}"
                                    </button>
                                  ) : null}
                                </div>
                              )}
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleAddTag(tagInput.trim())}
                            disabled={
                              !tagInput.trim() || formData.tags.length >= 5
                            }
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Selected Tags */}
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="flex items-center gap-1 bg-secondary text-secondary-foreground hover:bg-secondary-foreground/10 transition-colors"
                              >
                                <Hash className="h-3 w-3" />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="rounded-full hover:bg-secondary p-0.5 ml-1"
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">
                                    {t("blogs.remove")} {tag}
                                  </span>
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Popular Tags */}
                        {formData.tags.length < 5 && !showTagSuggestions && (
                          <div>
                            <p className="text-sm mb-2">
                              {t("blogs.popularTags")}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {SUGGESTED_TAGS.slice(0, 10)
                                .filter((tag) => !formData.tags.includes(tag))
                                .map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                                  >
                                    <Hash className="h-3 w-3 inline mr-1" />
                                    {tag}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        {errors.tags && (
                          <p className="text-sm text-destructive">
                            {errors.tags}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        {t("blogs.privacySettings")}
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg border border-border/50">
                        <div className="inline-flex items-center gap-2">
                          <Switch
                            id="anonymous"
                            checked={formData.anonymous}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                anonymous: checked,
                              }));
                            }}
                          />
                          <Label htmlFor="anonymous" className="sr-only">
                            {t("blogs.anonymousSwitch")}
                          </Label>
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="anonymous"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {t("blogs.postAnonymously")}
                          </label>
                          <p className="text-xs mt-1">
                            {t("blogs.anonymousDescription")}
                          </p>
                        </div>
                        <User className="h-5 w-5 text-accent" />
                      </div>
                    </div>

                    {errors.form && (
                      <Alert className="border-destructive bg-destructive/10">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                          {errors.form}
                        </AlertDescription>
                      </Alert>
                    )}
                  </form>
                </TabsContent>

                <TabsContent value="preview" className="p-6">
                  <div className="space-y-6">
                    {/* Preview Header */}
                    <div className="text-center py-4 bg-muted rounded-lg border border-border/50">
                      <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium text-foreground">
                        {t("blogs.storyPreview")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("blogs.previewDescription")}
                      </p>
                    </div>

                    {/* Story Preview */}
                    <Card className="bg-card border-border">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {formData.anonymous ? "A" : "Y"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-foreground">
                                {formData.anonymous
                                  ? t("blogs.anonymous")
                                  : currentUser
                                  ? `${currentUser.firstName} ${currentUser.lastName}`
                                  : t("blogs.you")}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{t("blogs.justNow")}</span>
                                {getReadingTime() > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {getReadingTime()} {t("blogs.minRead")}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {formData.title && (
                          <h1 className="text-2xl font-bold text-foreground mt-4">
                            {formData.title}
                          </h1>
                        )}

                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>

                      <CardContent>
                        {formData.content ? (
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: formData.content,
                            }}
                          />
                        ) : (
                          <div className="text-center py-8 text-muted-foreground ">
                            <BookOpen className="h-12 w-12 mx-auto mb-3" />
                            <p>{t("blogs.contentPreviewPlaceholder")}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="p-6 border-t border-border">
                <div className="flex justify-between">
                  <Link to="/blog">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      {t("common.cancel")}
                    </Button>
                  </Link>
                  <Button
                    onClick={(e) => handleSubmit(e)}
                    disabled={
                      isSubmitting ||
                      !formData.title.trim() ||
                      !formData.content.trim()
                    }
                    className="cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("blogs.publishing")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("blogs.publishStory")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Writing Tips */}
            <Card className="bg-card backdrop-blur-sm border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  {t("blogs.writingTips")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong>{t("blogs.tips.beSpecific.title")}:</strong>{" "}
                      {t("blogs.tips.beSpecific.description")}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong>{t("blogs.tips.focusOnGrowth.title")}:</strong>{" "}
                      {t("blogs.tips.focusOnGrowth.description")}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong>{t("blogs.tips.beAuthentic.title")}:</strong>{" "}
                      {t("blogs.tips.beAuthentic.description")}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong>{t("blogs.tips.includeHope.title")}:</strong>{" "}
                      {t("blogs.tips.includeHope.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-lavender-50 to-coral-50 border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5" />
                  {t("blogs.communityGuidelines")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    {t("blogs.guidelines.respectful")}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    {t("blogs.guidelines.privacy")}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    {t("blogs.guidelines.personal")}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    {t("blogs.guidelines.warnings")}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    {t("blogs.guidelines.inspire")}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {t("blogs.yourProgress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {getWordCount()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("blogs.words")}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {getReadingTime()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("blogs.minRead")}
                    </div>
                  </div>
                </div>

                {/* Opcional: Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("blogs.completion")}
                    </span>
                    <span className="text-foreground font-medium">
                      {Math.min(
                        100,
                        Math.round(
                          (formData.title.length > 0 ? 25 : 0) +
                            (getCharCount() > 200 ? 50 : getCharCount() / 4) +
                            (formData.tags.length > 0 ? 25 : 0)
                        )
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (formData.title.length > 0 ? 25 : 0) +
                              (getCharCount() > 200 ? 50 : getCharCount() / 4) +
                              (formData.tags.length > 0 ? 25 : 0)
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
