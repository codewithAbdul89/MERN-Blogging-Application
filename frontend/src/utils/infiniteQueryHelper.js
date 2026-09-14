export const likeBlogInInfiniteQuery = (queryClient, queryKey, blogId) => {
  queryClient.setQueriesData(
    {
      queryKey,
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
                    isLiked: !blog.isLiked,
                    likesCount: blog.isLiked
                      ? blog.likesCount - 1
                      : blog.likesCount + 1,
                  }
                : blog,
            ),
          },
        })),
      };
    },
  );
};

export const bookmarkInfinteQuery = (queryClient, queryKey, blogId) => {
  queryClient.setQueriesData(
    {
      queryKey,
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
                    isBookmarked: !blog.isBookmarked,
                  }
                : blog,
            ),
          },
        })),
      };
    },
  );
};
