import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import {
    getComments,
    getReplies
} from "./commentService.js";


export const useComments = (blogId) => {

    return useInfiniteQuery({

        queryKey: QUERY_KEYS.COMMENTS(blogId),

        queryFn: ({ pageParam = 1 }) =>
            getComments({
                blogId,
                page: pageParam
            }),

        enabled: !!blogId,

        getNextPageParam: (lastPage) => {

            return lastPage.hasMore ?
                lastPage.page + 1
                : undefined;
        }

    })

};

export const useReplies = (parentCommentId) => {

    return useInfiniteQuery({

        queryKey: QUERY_KEYS.REPLIES(parentCommentId),

        queryFn: ({ pageParam = 1 }) =>
            getReplies({
                parentCommentId,
                page: pageParam
            }),

        enabled: !!parentCommentId,

        getNextPageParam: (lastPage) => {

            return lastPage.hasMore
                ? lastPage.page + 1
                : undefined;

        }

    });

};