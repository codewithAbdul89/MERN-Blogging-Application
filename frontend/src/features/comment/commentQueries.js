import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { getComments, getReplies } from "./commentService.js";

export const useComments = (blogId) => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.COMMENTS(blogId),

    queryFn: ({ pageParam = 1 }) =>
      getComments({
        blogId,
        page: pageParam,
        limit: 6,
      }),

    initialPageParam: 1,

    enabled: Boolean(blogId),

    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasMore ? lastPage.data.page + 1 : undefined;
    },
  });

  const comments = query?.data?.pages.flatMap((page) => page?.data?.comments ?? []) ?? [];

  return {
    ...query,
    comments,
  };
};

export const useReplies = (commentId) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.REPLIES(commentId),

    queryFn: ({ pageParam = 1 }) =>
      getReplies({
        parentCommentId: commentId,
        page: pageParam,
        limit: 4,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasMore ? lastPage.data.page + 1 : undefined;
    },

    enabled: Boolean(commentId),
  });
};
