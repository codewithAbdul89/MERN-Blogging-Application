import { QUERY_KEYS } from "../../constants/queryKeys.js";

import {
    getBlogs,
    getMyBlogs,
    getSingleBlog,
    getLikedBlogs,
    getBookmarkedBlogs,
    getSearchedBlogs
} from "../blog/blogService.js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useBlogs = () => {

    return useInfiniteQuery({
        queryKey: QUERY_KEYS.HOME_BLOGS,

        queryFn: ({ pageParam = 1 }) => getBlogs({
            page: pageParam,
            limit: 10
        }),

        //here last page is the previuos api response

        getNextPageParam: (lastPage) => {

            return lastPage.hasMore
                ? lastPage.page + 1
                : undefined;

        },

        refetchOnMount: true

    })

};

export const useMyBlogs = (status) => {
    return useQuery({
        queryKey: QUERY_KEYS.MY_BLOGS(status),
        queryFn: () => getMyBlogs(status)
    });
};

export const useSearchedblogs = (params) => {

    return useInfiniteQuery({

        queryKey: QUERY_KEYS.SEARCH_BLOGS,

        queryFn: ({ pageParam = 1 }) => getSearchedBlogs({
            page: pageParam,
            limit: 10,
            ...params
        }),

        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.page + 1 : undefined
        }

    });
};

export const useSingleBlog = (slug) => {

    return useQuery({
        queryKey: QUERY_KEYS.BLOG(slug),
        queryFn: () => getSingleBlog(slug),
        enabled: !!slug
    });

};

export const usePrefetchSingleBlog = () => {

    const queryClient = useQueryClient();

    return (slug) => {

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.BLOG(slug),
            queryFn: () => getSingleBlog(slug)
        });

    };

};

export const useLikedBlogs = () => {
    return useQuery({
        queryKey: QUERY_KEYS.LIKED_BLOGS,
        queryFn: getLikedBlogs
    });
};

export const useBookmarkedBlogs = () => {
    return useQuery({
        queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,
        queryFn: getBookmarkedBlogs
    });
};