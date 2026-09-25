import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Comment from "./Comment.jsx";
import { useComments } from "../../features/comment/commentQueries";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Button from "../../components/ui/Button.jsx";
import ButtonLoader from "../../components/ui/ButtonLoader.jsx";
import { useEffect, useState } from "react";
import { useCreateComment } from "../../features/comment/commentMutations.js";
import { createCommentSchema } from "../../features/comment/commentValidation.js";

function useCommentsVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const commentsSection = document.getElementById("comments");

    if (!commentsSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(commentsSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  return isVisible;
}

// Tracks how much the page footer currently overlaps the bottom of the  viewport,
function useFooterOverlap(footerSelector = "footer") {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const footer = document.querySelector(footerSelector);

    if (!footer) {
      return;
    }

    const updateOverlap = () => {
      const rect = footer.getBoundingClientRect();
      const amount = window.innerHeight - rect.top;
      setOverlap(amount > 0 ? amount : 0);
    };

    updateOverlap();

    window.addEventListener("scroll", updateOverlap, { passive: true });
    window.addEventListener("resize", updateOverlap);

    return () => {
      window.removeEventListener("scroll", updateOverlap);
      window.removeEventListener("resize", updateOverlap);
    };
  }, [footerSelector]);

  return overlap;
}

function CommentSection({ blogId }) {
  const { comments, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useComments(blogId);

  const isCommentsVisible = useCommentsVisibility();
  const footerOverlap = useFooterOverlap();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const [replyingTo, setReplyingTo] = useState(null);

  const { mutateAsync: createComment, isPending: isCommentCreationPending } = useCreateComment();

  const handleReply = (comment) => {
    setReplyingTo({
      id: comment._id,
      userName: comment.author?.userName || "User",
    });

    setFocus("content");
  };

  const {
    reset,
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onCommentSubmit = async (data) => {
    try {
      const commentData = {
        content: data.content,
        ...(replyingTo && {
          parentComment: replyingTo.id,
        }),
      };

      await createComment({
        blogId,
        commentData,
      });

      reset();
      setReplyingTo(null);
    } catch (error) {
      console.log("Error in creating comment:", error);
    }
  };

  if (isPending) {
    return (
      <div className="py-8">
        <p className="text-text-muted text-sm">Loading comments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8">
        <p className="text-danger text-sm">Unable to load comments.</p>
      </div>
    );
  }

  return (
    <>
      {/* Comments */}
      <div className="w-full px-1 pb-40 sm:px-5">
        {comments.length > 0 ? (
          <div className="space-y-8">
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} onReply={handleReply} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-text-primary text-lg font-semibold">No comments yet</p>

            <p className="text-text-muted mt-1 text-sm">Be the first person to leave a comment.</p>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasNextPage && <div ref={loadMoreRef} className="h-10" aria-hidden="true" />}

        {/* Loading more */}
        {isFetchingNextPage && (
          <div className="py-6 text-center">
            <p className="text-text-muted text-sm">Loading more comments...</p>
          </div>
        )}
      </div>

      {/* Fixed comment composer — lifts above the footer instead of covering it */}
      {isCommentsVisible && (
        <div
          className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-50 border-t px-3 py-2 backdrop-blur-md sm:px-6 sm:py-4"
          style={{ bottom: footerOverlap }}
        >
          <form
            onSubmit={handleSubmit(onCommentSubmit)}
            className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 sm:flex-row sm:gap-3"
          >
            <div className="w-full">
              <textarea
                {...register("content")}
                rows={3}
                placeholder={
                  replyingTo ? `Reply to @${replyingTo.userName}...` : "Add a comment..."
                }
                className="border-border bg-background text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-primary/20 h-full min-h-11 w-full flex-1 resize-none scrollbar-none overflow-y-auto rounded-xl border px-4 py-3 text-sm leading-5 transition-colors outline-none [-ms-overflow-style:none] focus:ring-1 [&::-webkit-scrollbar]:hidden"
              />
              {errors?.content?.message && (
                <p className="px-3 text-sm text-red-500">{errors?.content?.message}</p>
              )}
            </div>

            <div className="mx-4 mb-5 flex items-center justify-between gap-3 sm:mb-0 sm:gap-5">
              {replyingTo && (
                <Button
                  type="button"
                  text="Cancel Reply"
                  onClick={() => setReplyingTo(null)}
                  className="bg-danger hover:bg-danger/80 text mt-2 w-38 shrink-0 rounded-lg px-4 py-3 text-white sm:mt-0 sm:px-2"
                />
              )}
              <Button
                type="submit"
                text={
                  !isCommentCreationPending ? (
                    replyingTo == null ? (
                      "Post Comment"
                    ) : (
                      "Post Reply"
                    )
                  ) : (
                    <ButtonLoader text="Posting" />
                  )
                }
                className="bg-primary hover:bg-primary-hover text mt-2 w-38 shrink-0 rounded-lg px-4 py-3 text-white sm:mt-0 sm:px-2"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default CommentSection;
