import { useSelector } from "react-redux";
import { QUERY_KEYS } from "../../constants/queryKeys.js";

import {
  getBlogs,
  getMyBlogs,
  getSingleBlog,
  getLikedBlogs,
  getBookmarkedBlogs,
  getSearchedBlogs,
  blogStats,
  getBlogForEdit,
  getUserProfile,
} from "../blog/blogService.js";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBlogs = () => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.HOME_BLOGS,

    queryFn: ({ pageParam = 1 }) =>
      getBlogs({
        page: pageParam,
        limit: 6,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
  });

  const blogs = query?.data?.pages.flatMap((page) => page.data.blogs) ?? [];

  return {
    ...query,
    blogs,
  };
};

export const useMyBlogs = (status) => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.MY_BLOGS(status),

    queryFn: ({ pageParam = 1 }) =>
      getMyBlogs({
        page: pageParam,
        limit: 6,
        status,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
  });

  const blogs = query?.data?.pages.flatMap((page) => page.data.blogs) ?? [];

  return {
    ...query,
    blogs,
  };
};

export const useSearchedblogs = (params) => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.SEARCH_BLOGS(params),

    queryFn: ({ pageParam = 1 }) =>
      getSearchedBlogs({
        page: pageParam,
        limit: 6,
        ...params,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
    enabled: Boolean(params?.categorySlug || params?.textSearch),
  });

  const blogs = query?.data?.pages.flatMap((page) => page.data.blogs) ?? [];

  return {
    ...query,
    blogs,
  };
};

export const useSingleBlog = (slug) => {
  return useQuery({
    queryKey: QUERY_KEYS.BLOG(slug),
    queryFn: () => getSingleBlog(slug),
    enabled: !!slug,
  });
};

export const usePrefetchSingleBlog = () => {
  const queryClient = useQueryClient();

  const { isAuthenticated } = useSelector((state) => state.auth);

  return (slug) => {
    if (!slug || !isAuthenticated) return;

    return queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.BLOG(slug),
      queryFn: () => getSingleBlog(slug),
      staleTime: 60 * 1000,
    });
  };
};

export const useBlogForEdit = (blogId) => {
  return useQuery({
    queryKey: ["blog", "edit", blogId],
    queryFn: () => getBlogForEdit(blogId),
    enabled: !!blogId,
  });
};

export const useLikedBlogs = () => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.LIKED_BLOGS,

    queryFn: ({ pageParam = 1 }) =>
      getLikedBlogs({
        page: pageParam,
        limit: 6,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
  });

  const blogs = query?.data?.pages.flatMap((page) => page.data.blogs) ?? [];

  return {
    ...query,
    blogs,
  };
};

export const useBookmarkedBlogs = () => {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,

    queryFn: ({ pageParam = 1 }) =>
      getBookmarkedBlogs({
        page: pageParam,
        limit: 6,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
  });

  const blogs = query?.data?.pages.flatMap((page) => page.data.blogs) ?? [];

  return {
    ...query,
    blogs,
  };
};

export const useBlogStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.BLOG_STATS,
    queryFn: blogStats,
  });
};

export const useGetUserProfile = (userId) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.USER_PROFILE(userId),

    queryFn: ({ pageParam = 1 }) =>
      getUserProfile({
        page: pageParam,
        limit: 6,
        userId,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },

    enabled: Boolean(userId),
  });
};
