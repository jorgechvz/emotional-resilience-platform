import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useBlogPost from "../hooks/use-blog-post";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Loader2,
  MessageSquare,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTimeAgo, getUserInitials } from "@/courses/utils/course.lib";
import useBlogComments from "../hooks/use-blog-comments";
import { useAuthStore } from "@/auth/context/use-auth-store";
import type { BlogComment, BlogPost } from "../types/blog.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/courses/components/platform/state/loading-state";
import { useTranslation } from "@/lib/i18n";

const SingleBlogPost = () => {
  const { t } = useTranslation();
  const { storyId } = useParams<{ storyId: string }>();
  const { getBlogPostById, likeBlog } = useBlogPost(storyId);
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = currentUser?.id;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: story,
    isLoading: isLoadingStory,
    refetch: refetchStory,
  } = getBlogPostById as {
    data: BlogPost | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const { createNewComment, updateComment, deleteComment } = useBlogComments();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story?.likes || 0);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (story) {
      setLikeCount(story.likes);
    }
  }, [story]);

  if (isLoadingStory) {
    return <LoadingState />;
  }

  if (!story) {
    return (
      <div className="container py-10 text-center mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">
          {t("blogs.post.notFound.title")}
        </h1>
        <p className="mb-6">{t("blogs.post.notFound.message")}</p>
        <Link to="/stories">
          <Button>{t("blogs.post.notFound.viewAll")}</Button>
        </Link>
      </div>
    );
  }

  const handleLike = async () => {
    if (!isAuthenticated || !userId || !storyId) {
      navigate("/login");
      return;
    }
    if (liked) {
      return;
    }

    const originalLikeCount = likeCount;
    const originalLikedState = liked;

    setLikeCount((prev) => prev + 1);
    setLiked(true);

    try {
      await likeBlog.mutateAsync(storyId);
      refetchStory();
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error(t("blogs.post.errors.likeError"));
      setLikeCount(originalLikeCount);
      setLiked(originalLikedState);
    }
  };

  const promptDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setIsDeleteDialogOpen(true);
  };

  // Execute deletion after confirmation
  const confirmDeleteComment = async () => {
    if (!commentToDeleteId) return;

    const promise = deleteComment.mutateAsync(commentToDeleteId);

    toast.promise(promise, {
      loading: t("blogs.comments.deleting"),
      success: () => {
        refetchStory();
        return t("blogs.comments.deleteSuccess");
      },
      error: t("blogs.comments.deleteError"),
      richColors: true,
    });
    setCommentToDeleteId(null);
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim() || !storyId) return;

    const promise = createNewComment.mutateAsync({
      postId: storyId,
      content: commentText,
      author: currentUser?.firstName + " " + currentUser?.lastName,
    });

    toast.promise(promise, {
      loading: t("blogs.comments.posting"),
      success: () => {
        setCommentText("");
        refetchStory();
        return t("blogs.comments.postSuccess");
      },
      error: t("blogs.comments.postError"),
      richColors: true,
    });
  };

  const handleEditComment = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editContent.trim()) return;

    const promise = updateComment.mutateAsync({
      commentId: editingCommentId,
      content: editContent,
    });

    toast.promise(promise, {
      loading: t("blogs.comments.updating"),
      success: () => {
        setEditingCommentId(null);
        setEditContent("");
        refetchStory();
        return t("blogs.comments.updateSuccess");
      },
      error: t("blogs.comments.updateError"),
    });
  };

  return (
    <div className="container py-10 max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <Link
          to="/stories"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-primary hover:text-primary/80"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("blogs.post.backToAll")}
        </Link>
      </div>
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                {story.title}
              </CardTitle>
              <CardDescription>
                {t("blogs.post.postedBy")} {getTimeAgo(story.createdAt)}{" "}
                {t("blogs.post.author")}{" "}
                {story.author == null
                  ? t("blogs.post.anonymous")
                  : story.author}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          <div className="flex items-center justify-start gap-4 mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1.5 text-muted-foreground hover:text-primary ${
                liked ? "text-red-500 hover:text-red-600" : ""
              }`}
              onClick={handleLike}
              disabled={!isAuthenticated || likeBlog.isPending}
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-current text-red-500" : ""
                }`}
              />
              {likeCount}{" "}
              {likeCount === 1 ? t("blogs.post.like") : t("blogs.post.likes")}
            </Button>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              {story.comments?.length || 0}{" "}
              {story.comments?.length === 1
                ? t("blogs.post.comment")
                : t("blogs.post.comments")}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">
          {t("blogs.comments.title")} ({story.comments?.length || 0})
        </h2>

        {isAuthenticated ? (
          <Card className="mb-8 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                {t("blogs.comments.leaveComment")}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmitComment}>
              <CardContent>
                <Textarea
                  placeholder={t("blogs.comments.placeholder")}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[120px] focus:ring-primary focus:border-primary"
                  rows={4}
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-2">
                <p className="text-sm text-muted-foreground">
                  {t("blogs.comments.beKind")}
                </p>
                <Button
                  type="submit"
                  disabled={!commentText.trim() || createNewComment.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {createNewComment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("blogs.comments.publishing")}
                    </>
                  ) : (
                    t("blogs.comments.publish")
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="mb-8 p-6 text-center shadow-md bg-muted/30">
            <p className="text-lg mb-3">
              {t("blogs.comments.joinConversation")}
            </p>
            <Link
              to="/auth/login"
              state={{ from: location }}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              {t("blogs.comments.loginToComment")}
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              {t("blogs.comments.quickAndEasy")}
            </p>
          </Card>
        )}

        <div className="space-y-6">
          {story.comments && story.comments?.length > 0 ? (
            story.comments.map((comment) => (
              <Card key={comment.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary font-medium">
                          {comment.author
                            ? getUserInitials(comment.author)
                            : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-md font-semibold">
                          {comment.author || t("blogs.comments.anonymous")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {getTimeAgo(comment.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                    {isAuthenticated && userId === comment.user.id && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditComment(comment)}
                          className="h-8 w-8 hover:bg-muted"
                          title={t("blogs.comments.editComment")}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => promptDeleteComment(comment.id)}
                          disabled={
                            deleteComment.isPending &&
                            deleteComment.variables === comment.id
                          }
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          title={t("blogs.comments.deleteComment")}
                        >
                          {deleteComment.isPending &&
                          deleteComment.variables === comment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingCommentId === comment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] focus:ring-primary focus:border-primary"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent("");
                          }}
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={
                            updateComment.isPending || !editContent.trim()
                          }
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {updateComment.isPending &&
                          updateComment.variables?.commentId === comment.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {t("common.save")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {t("blogs.comments.noCommentsYet")}
            </p>
          )}
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("blogs.comments.delete.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("blogs.comments.delete.confirmMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentToDeleteId(null)}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDeleteComment();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("blogs.comments.delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default SingleBlogPost;
