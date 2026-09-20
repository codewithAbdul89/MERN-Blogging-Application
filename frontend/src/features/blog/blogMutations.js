import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import {
  createBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  sendDeleteBlogOtp,
  updateBlog,
  verifyDeleteBlogOtp,
  pinBlog,
  toggleLike,
  toggleBookmark,
} from "./blogService.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { showSuccess } from "../../utils/toast.js";
import { likeBlogInInfiniteQuery, bookmarkInfinteQuery } from "../../utils/infiniteQueryHelper.js";
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      showSuccess(data.message);
    },

    onError: errorHandler,
  });
};
// blogId, blogData, oldSlug Optimistic
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlog,

    onSuccess: (data, variables) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.BLOG(variables.oldSlug),
      });

      queryClient.setQueryData(QUERY_KEYS.BLOG(data?.data?.blog?.slug), data);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      showSuccess(data.message);
    },

    onError: errorHandler,
  });
};
//blogId
export const usePublishBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishBlog,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      showSuccess(data.message);
    },

    onError: (error) => errorHandler(error),
  });
};
//blogId
export const useUnpublishBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishBlog,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      showSuccess(data.message);
    },

    onError: (error) => errorHandler(error),
  });
};
//blogId Optimistic
export const useTogglePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pinBlog,

    onMutate: async (variables) => {
      const { blogId } = variables;

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      const previousMyBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.MY_HOME_BLOGS,
      });

      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.MY_HOME_BLOGS,
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            pages: oldData.pages.map((page) => ({
              ...page,

              data: {
                ...page.data,

                blogs: page.data.blogs.map((blog) =>
                  blog._id === blogId
                    ? {
                        ...blog,

                        isPinned: !blog.isPinned,
                      }
                    : blog
                ),
              },
            })),
          };
        }
      );

      return { previousMyBlogs };
    },

    onError: (error, variables, context) => {
      context?.previousMyBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      errorHandler(error);
    },

    onSuccess: (data) => {
      showSuccess(data.message);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });
    },
  });
};
//blogId
export const useSendDeleteBlogOtp = () => {
  return useMutation({
    mutationFn: sendDeleteBlogOtp,

    onError: errorHandler,

    onSuccess: (data) => {
      showSuccess(data.message);
    },
  });
};
//otp
export const useVerifyDeleteBlogOtp = () => {
  return useMutation({
    mutationFn: verifyDeleteBlogOtp,

    onError: errorHandler,

    onSuccess: (data) => {
      data.message;
    },
  });
};
//status+blogId+slug
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,

    onMutate: async (variables) => {
      const { blogId, status, slug } = variables;

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MY_BLOGS(status),
      });

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      if (slug) {
        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.BLOG(slug),
        });
      }

      const previousMyBlogs = queryClient.getQueryData(QUERY_KEYS.MY_BLOGS(status));

      const previousBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      const singleBlog = slug ? queryClient.getQueryData(QUERY_KEYS.BLOG(slug)) : null;

      //update the single blog

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.BLOG(slug),
      });

      //update my blog list

      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.MY_BLOGS(status),
        },

        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                blogs: page.data.blogs.filter((blog) => blog._id !== blogId),
              },
            })),
          };
        }
      );

      //update the home blog list
      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.HOME_BLOGS,
        },

        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                blogs: page.data.blogs.filter((blog) => blog._id !== blogId),
              },
            })),
          };
        }
      );

      return {
        previousMyBlogs,
        previousBlogs,
        singleBlog,
      };
    },

    onError: (error, variables, context) => {
      context?.previousBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      context?.previousMyBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      if (context?.singleBlog) {
        queryClient.setQueryData(QUERY_KEYS.BLOG(variables.slug), context.singleBlog);
      }

      errorHandler(error);
    },

    onSuccess: (data) => {
      showSuccess(data.message);
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      if (variables.slug) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BLOG(variables.slug),
        });
      }
    },
  });
};
//blogid+slug complete
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,

    onMutate: async (variables) => {
      const { blogId, slug, status = "all" } = variables;

      const myBlogsKey = QUERY_KEYS.MY_BLOGS(status);

      await queryClient.cancelQueries({
        queryKey: myBlogsKey,
      });

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.LIKED_BLOGS,
      });

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.SEARCH_BLOGS_ROOT,
      });

      if (slug) {
        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.BLOG(slug),
        });
      }

      const previousBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      const previousMyBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.MY_HOME_BLOGS,
      });

      const previousLikedBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.LIKED_BLOGS,
      });

      const previousBookmarkedBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,
      });

      const previousSearchBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.SEARCH_BLOGS_ROOT,
      });

      const singleBlog = queryClient.getQueryData(QUERY_KEYS.BLOG(slug));

      // update the my bogs
      likeBlogInInfiniteQuery(queryClient, QUERY_KEYS.MY_BLOGS(status), blogId);

      // update home blogs
      likeBlogInInfiniteQuery(queryClient, QUERY_KEYS.HOME_BLOGS, blogId);

      // update the liked blog list
      likeBlogInInfiniteQuery(queryClient, QUERY_KEYS.LIKED_BLOGS, blogId);

      // update the bookmark list
      likeBlogInInfiniteQuery(queryClient, QUERY_KEYS.BOOKMARKED_BLOGS, blogId);
      // update the searched blogs
      likeBlogInInfiniteQuery(queryClient, QUERY_KEYS.SEARCH_BLOGS_ROOT, blogId);

      if (singleBlog) {
        queryClient.setQueryData(QUERY_KEYS.BLOG(slug), (oldData) => {
          if (!oldData?.data?.blog) return oldData;

          const blog = oldData.data.blog;

          return {
            ...oldData,
            data: {
              blog: {
                ...blog,
                isLiked: !blog.isLiked,
                likesCount: blog.isLiked ? Math.max(0, blog.likesCount - 1) : blog.likesCount + 1,
              },
            },
          };
        });
      }
      return {
        previousBlogs,
        singleBlog,
        previousLikedBlogs,
        previousMyBlogs,
        previousBookmarkedBlogs,
        previousSearchBlogs,
      };
    },

    onError: (error, variables, context) => {
      // set previous data to home_blogs
      context?.previousBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      // set previous data to My_blogs
      if (context?.previousMyBlogs !== undefined) {
        queryClient.setQueryData(context.myBlogsKey, context.previousMyBlogs);
      }
      // set previous liked blogs
      context?.previousLikedBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      // set previous liked blogs
      context?.previousBookmarkedBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      // set previous searched blogs
      context?.previousSearchBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      // set single blog
      if (context?.singleBlog) {
        queryClient.setQueryData(QUERY_KEYS.BLOG(variables.slug), context.singleBlog);
      }

      errorHandler(error);
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.blogStats,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LIKED_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_BLOGS_ROOT,
      });

      if (variables.slug) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BLOG(variables.slug),
        });
      }
    },
  });
};
//blogid+slug complete
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBookmark,

    onMutate: async (variables) => {
      const { blogId, slug } = variables;

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,
      });

      if (slug) {
        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.BLOG(slug),
        });
      }
      // previous Bookmarked
      const previousBookmarked = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,
      });
      // previous Home blogs
      const previousBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      const previousLikedBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.LIKED_BLOGS,
      });

      const previousSearchBlogs = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.SEARCH_BLOGS_ROOT,
      });

      const singleBlog = queryClient.getQueryData(QUERY_KEYS.BLOG(slug));

      // Update all blog lists

      bookmarkInfinteQuery(queryClient, QUERY_KEYS.HOME_BLOGS, blogId);

      // update the bookmarked blogs
      bookmarkInfinteQuery(queryClient, QUERY_KEYS.BOOKMARKED_BLOGS, blogId);

      // update the liked blogs
      bookmarkInfinteQuery(queryClient, QUERY_KEYS.LIKED_BLOGS, blogId);
      // update the search blogs
      bookmarkInfinteQuery(queryClient, QUERY_KEYS.SEARCH_BLOGS_ROOT, blogId);

      if (singleBlog) {
        queryClient.setQueryData(QUERY_KEYS.BLOG(slug), (oldData) => {
          if (!oldData?.data?.blog) return oldData;

          const blog = oldData.data.blog;

          return {
            ...oldData,
            data: {
              blog: {
                ...blog,
                isBookmarked: !blog.isBookmarked,
              },
            },
          };
        });
      }

      return {
        singleBlog,
        previousBlogs,
        previousBookmarked,
        previousLikedBlogs,
        previousSearchBlogs,
      };
    },

    onError: (error, variables, context) => {
      context?.previousBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      context?.previousBookmarked?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      context?.previousSearchBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      context?.previousLikedBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      if (context?.singleBlog) {
        queryClient.setQueryData(QUERY_KEYS.BLOG(variables.slug), context.singleBlog);
      }

      errorHandler(error);
    },

    onSuccess: (data) => {
      data.message;
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKMARKED_BLOGS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HOME_BLOGS,
      });

      if (variables.slug) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BLOG(variables.slug),
        });
      }
    },
  });
};
