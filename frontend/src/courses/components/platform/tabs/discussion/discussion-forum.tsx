import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useDiscussionUIStore } from "@/courses/context/discussion-store";
import {
  useChapterDiscussions,
  useCreateDiscussion,
  useCreateReply,
} from "@/courses/hooks/use-discussions";
import { getTimeAgo, getUserInitials } from "@/courses/utils/course.lib";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Shield,
  Loader,
  CornerDownRight,
} from "lucide-react";
import React from "react";
import ReplyThread from "./reply-thread";
import { useTranslation } from "@/lib/i18n";
import { DiscussionForumSkeleton } from "./discussion-skeleton";

interface DiscussionForumProps {
  courseId: string;
  chapterId: string;
}

export const DiscussionForum: React.FC<DiscussionForumProps> = ({
  courseId,
  chapterId,
}) => {
  const { t } = useTranslation();
  const {
    data: discussions = [],
    isLoading,
    isError,
  } = useChapterDiscussions(courseId, chapterId);

  const createDiscussionMutation = useCreateDiscussion();
  const createReplyMutation = useCreateReply();

  const {
    expandedThreads,
    replyingTo,
    replyContent,
    newDiscussion,

    toggleThreadExpansion,
    startReply,
    cancelReply,
    setReplyContent,
    setNewDiscussionField,
    resetNewDiscussion,
  } = useDiscussionUIStore();

  const handleSubmitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    createDiscussionMutation.mutate(
      {
        courseId,
        chapterId,
        data: newDiscussion,
      },
      {
        onSuccess: () => {
          resetNewDiscussion();
        },
      }
    );
  };

  const handleSubmitReply = () => {
    if (!replyingTo || !replyContent.trim()) return;

    createReplyMutation.mutate(
      {
        discussionId: replyingTo.discussionId,
        parentReplyId: replyingTo.parentReplyId,
        content: replyContent,
      },
      {
        onSuccess: () => {
          cancelReply();
        },
      }
    );
  };

  if (isLoading) return <DiscussionForumSkeleton />;
  if (isError) return <div>{t("discussions.error")}</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">
              {t("discussions.forumTitle")}
            </h3>
            <p className="text-neutral-600">
              {t("discussions.forumDescription")}
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-primary/50 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {t("discussions.newThreadTitle")}
          </CardTitle>
          <CardDescription>
            {t("discussions.newThreadDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitDiscussion} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discussion-title">
                {t("discussions.threadTitleLabel")}
              </Label>
              <Input
                id="discussion-title"
                placeholder={t("discussions.threadTitlePlaceholder")}
                className="bg-white"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussionField("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discussion-content">
                {t("discussions.messageLabel")}
              </Label>
              <Textarea
                id="discussion-content"
                placeholder={t("discussions.messagePlaceholder")}
                className="min-h-[120px] bg-white"
                value={newDiscussion.content}
                onChange={(e) =>
                  setNewDiscussionField("content", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  !newDiscussion.title.trim() ||
                  !newDiscussion.content.trim() ||
                  createDiscussionMutation.isPending
                }
              >
                {createDiscussionMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t("discussions.creating")}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("discussions.createThread")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {discussions.map((discussion) => {
          const discussionReplies = discussion.replies || [];
          const totalReplies = discussion.repliesCount || 0;

          return (
            <div
              key={discussion.id}
              className="border rounded-lg overflow-hidden border-primary/50 bg-white"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm flex-shrink-0">
                    <AvatarImage
                      src={discussion.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-primary-500 to-secondary/500">
                      {getUserInitials(
                        `${discussion.user.firstName} ${discussion.user.lastName}`
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-neutral-800">
                          {discussion.user.firstName} {discussion.user.lastName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span>{getTimeAgo(discussion.createdAt)}</span>
                        {totalReplies === 0 && (
                          <>
                            <span>•</span>
                            <Badge className="text-xs">
                              {t("discussions.noRepliesYet")}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-3">
                      {discussion.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">
                      {discussion.content}
                    </p>
                    <div className="flex flex-wrap items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary/80 hover:bg-primary/20"
                        onClick={() => startReply(discussion.id, null)}
                      >
                        <CornerDownRight className="w-4 h-4" />
                        {t("discussions.reply")}
                      </Button>
                      {totalReplies > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-600 hover:bg-neutral-50"
                          onClick={() => toggleThreadExpansion(discussion.id)}
                        >
                          {expandedThreads.has(discussion.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {totalReplies}{" "}
                          {totalReplies === 1
                            ? t("discussions.reply")
                            : t("discussions.replies")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {replyingTo?.discussionId === discussion.id &&
                replyingTo.parentReplyId === null && (
                  <div className="px-6 pb-6">
                    <div className="bg-secondary/10 border border-primary/50 p-4 rounded-lg">
                      <Label
                        htmlFor={`reply-main-${discussion.id}`}
                        className="text-sm font-medium text-neutral-800 mb-2 block"
                      >
                        {t("discussions.replyTo")} {discussion.user.firstName}{" "}
                        {discussion.user.lastName}
                      </Label>
                      <Textarea
                        id={`reply-main-${discussion.id}`}
                        placeholder={t("discussions.replyPlaceholder")}
                        className="min-h-[80px] bg-white border-primary/30 mb-3"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSubmitReply}
                          disabled={
                            !replyContent.trim() ||
                            createReplyMutation.isPending
                          }
                        >
                          {createReplyMutation.isPending ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              {t("discussions.posting")}
                            </>
                          ) : (
                            t("discussions.postReply")
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelReply}
                        >
                          {t("common.cancel")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              {expandedThreads.has(discussion.id) &&
                discussionReplies.length > 0 && (
                  <div className="bg-primary-50/30 border-t border-primary-200 p-6">
                    <div className="space-y-4">
                      {discussionReplies.map((reply) => (
                        <ReplyThread key={reply.id} reply={reply} depth={0} />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-primary/50 to-emerald-800 border-primary-200 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                {t("discussions.forumGuidelines")}
              </h4>
              <ul className="text-sm text-white space-y-1">
                <li>• {t("discussions.guidelines.respectful")}</li>
                <li>• {t("discussions.guidelines.constructive")}</li>
                <li>• {t("discussions.guidelines.relevant")}</li>
                <li>• {t("discussions.guidelines.organized")}</li>
                <li>• {t("discussions.guidelines.report")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
