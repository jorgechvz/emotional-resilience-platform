import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDiscussionUIStore } from "@/courses/context/discussion-store";
import {
  useCreateReply,
  useRepliesForParent,
} from "@/courses/hooks/use-discussions";
import type { DiscussionReply } from "@/courses/types/discussion.types";
import { getTimeAgo, getUserInitials } from "@/courses/utils/course.lib";
import { useTranslation } from "@/lib/i18n";
import { CornerDownRight, ChevronDown, ChevronUp, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

const ReplyThread = React.memo(
  ({
    reply,
    depth = 0,
    defaultExpand = false,
  }: {
    reply: DiscussionReply;
    depth?: number;
    defaultExpand?: boolean;
  }) => {
    const { t } = useTranslation();
    const initialChildReplies = reply.childReplies ?? [];
    const localChildCount = initialChildReplies.length;

    const [isExpanded, setIsExpanded] = useState(
      defaultExpand || localChildCount > 0
    );

    const {
      data: fetchedChildReplies = [],
      isLoading: isLoadingChildren,
      isError: isErrorChildren,
      refetch: fetchChildren,
      isFetched: childrenFetched,
    } = useRepliesForParent(reply.id, false);

    const totalChildCount = reply.childRepliesCount ?? localChildCount;
    const hasChildReplies = totalChildCount > 0;

    const mergedChildReplies = [
      ...initialChildReplies,
      ...fetchedChildReplies.filter(
        (fc) => !initialChildReplies.some((ic) => ic.id === fc.id)
      ),
    ];

    useEffect(() => {
      if (
        isExpanded &&
        hasChildReplies &&
        !childrenFetched &&
        totalChildCount > localChildCount
      ) {
        fetchChildren();
      }
    }, [
      isExpanded,
      childrenFetched,
      fetchChildren,
      totalChildCount,
      localChildCount,
      hasChildReplies,
    ]);

    const {
      startReply: startReplyLocal,
      cancelReply: cancelReplyLocal,
      replyingTo: replyingToLocal,
      replyContent: replyContentLocal,
      setReplyContent: setReplyContentLocal,
    } = useDiscussionUIStore();

    const createReplyLoc = useCreateReply();
    const handleSubmitReplyLocal = () => {
      if (!replyingToLocal || !replyContentLocal.trim()) return;
      createReplyLoc.mutate(
        {
          discussionId: replyingToLocal.discussionId,
          parentReplyId: replyingToLocal.parentReplyId,
          content: replyContentLocal,
        },
        { onSuccess: () => cancelReplyLocal() }
      );
    };

    return (
      <div className={`${depth > 0 ? "ml-6 mt-4" : ""} relative`}>
        {depth > 0 && (
          <>
            <div className="absolute -left-6 top-0 w-6 h-6 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
            <div className="absolute -left-6 top-6 bottom-0 w-0.5 bg-primary"></div>
          </>
        )}

        <div className="bg-white border p-4 rounded-lg hover:shadow-sm transition-shadow">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={reply.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {getUserInitials(
                  `${reply.user.firstName} ${reply.user.lastName}`
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium text-neutral-800 text-sm">
                  {reply.user.firstName} {reply.user.lastName}
                </h5>
                <span className="text-xs text-neutral-500">
                  {getTimeAgo(reply.createdAt)}
                </span>
              </div>
              <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
                {reply.content}
              </p>
              <div className="flex items-center gap-2">
                {depth < 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary/80 hover:bg-primary/20"
                    onClick={() =>
                      startReplyLocal(reply.discussionId, reply.id)
                    }
                  >
                    <CornerDownRight className="w-3 h-3" />{" "}
                    {t("discussions.reply")}
                  </Button>
                )}
                {hasChildReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-xs h-7"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {isExpanded
                      ? t("discussions.hideReplies")
                      : `${t("discussions.view")} ${totalChildCount} ${
                          totalChildCount === 1
                            ? t("discussions.viewSingleAnswer")
                            : t("discussions.replies")
                        }`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {replyingToLocal?.discussionId === reply.discussionId &&
          replyingToLocal.parentReplyId === reply.id && (
            <div className="mt-4 ml-6">
              <div className="bg-secondary/50 border p-4 rounded-lg">
                <Label
                  htmlFor={`reply-childe-${reply.discussionId}`}
                  className="text-sm font-medium text-neutral-800 mb-2 block"
                >
                  {t("discussions.replyTo")} {reply.user.firstName}{" "}
                  {reply.user.lastName}
                </Label>
                <Textarea
                  id={`reply-${reply.id}`}
                  value={replyContentLocal}
                  onChange={(e) => setReplyContentLocal(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitReplyLocal}
                    disabled={
                      !replyContentLocal.trim() || createReplyLoc.isPending
                    }
                  >
                    {createReplyLoc.isPending ? (
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
                    onClick={cancelReplyLocal}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            </div>
          )}

        {isExpanded && (
          <div className="mt-4">
            {isLoadingChildren ? (
              <div>{t("discussions.loadingReplies")}</div>
            ) : isErrorChildren ? (
              <div>{t("discussions.errorLoadingReplies")}</div>
            ) : mergedChildReplies.length === 0 ? (
              <div>{t("discussions.noRepliesYet")}</div>
            ) : (
              mergedChildReplies.map((child) => (
                <ReplyThread
                  key={child.id}
                  reply={child}
                  depth={depth + 1}
                  defaultExpand={false}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }
);

export default ReplyThread;
