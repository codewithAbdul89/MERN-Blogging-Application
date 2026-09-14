import { QUERY_KEYS } from "../../constants/queryKeys.js";

import {
  getBlogs,
  getMyBlogs,
  getSingleBlog,
  getLikedBlogs,
  getBookmarkedBlogs,
  getSearchedBlogs,
  blogStats,
} from "../blog/blogService.js";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.SEARCH_BLOGS,

    queryFn: ({ pageParam = 1 }) =>
      getSearchedBlogs({
        page: pageParam,
        limit: 10,
        ...params,
      }),

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
  });
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

  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.BLOG(slug),
      queryFn: () => getSingleBlog(slug),
    });
  };
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
    queryKey: QUERY_KEYS.blogStats,
    queryFn: blogStats,
  });
};
