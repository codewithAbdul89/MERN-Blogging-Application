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
    toggleBookmark
} from "./blogService.js";
import { handleMutationError } from "../../utils/errorHandler.js";
import { showSuccess } from "../../utils/toast.js";


export const useCreateBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBlog,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.HOME_BLOGS
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MY_BLOGS_ROOT
            });

            showSuccess(data.message)
        },

        onError: handleMutationError

    });

};
// blogId, blogData, oldSlug Optimistic
export const useUpdateBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateBlog,

        onSuccess: (data, variables) => {

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.BLOG(variables.oldSlug)
            });

            queryClient.setQueryData(
                QUERY_KEYS.BLOG(data?.blog?.slug),
                data
            );

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.HOME_BLOGS,
            });

            showSuccess(data.message)
        },

        onError: handleMutationError

    });
};
//blogId
export const usePublishBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: publishBlog,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.HOME_BLOGS
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MY_BLOGS_ROOT
            })

            showSuccess(data.message)

        },

        onError: handleMutationError

    });
};
//blogId
export const useUnpublishBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unpublishBlog,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.HOME_BLOGS
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MY_BLOGS_ROOT
            })

            showSuccess(data.message)
        },

        onError: handleMutationError

    });
};
//blogId+status Optimistic
export const usePinBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pinBlog,

        onMutate: async (variables) => {

            const { blogId, status } = variables;

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.MY_BLOGS(status),
            });

            const previousBlogs = queryClient.getQueryData(
                QUERY_KEYS.MY_BLOGS(status)
            );

            queryClient.setQueryData(

                QUERY_KEYS.MY_BLOGS(status),

                (oldData) => {

                    if (!oldData) return oldData;

                    return oldData.map((blog) => blog._id === blogId
                        ? {
                            ...blog,
                            isPinned: !blog.isPinned
                        }
                        : blog
                    );
                }
            );

            return { previousBlogs };
        },

        onError: (error, variables, context) => {

            if (context?.previousBlogs) {

                queryClient.setQueryData(
                    QUERY_KEYS.MY_BLOGS(variables.status),
                    context.previousBlogs
                );

            }

            handleMutationError(error);

        },

        onSuccess: (data) => {
            data.message
        },

        onSettled: (data, error, variables) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MY_BLOGS(variables.status),
            });

        }

    })
};
//blogId
export const useSendDeleteBlogOtp = () => {

    return useMutation({
        mutationFn: sendDeleteBlogOtp,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    })
};
//otp
export const useVerifyDeleteBlogOtp = () => {
    return useMutation({
        mutationFn: verifyDeleteBlogOtp,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }
    })
};
//status+blogId+slug
export const useDeleteBlog = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteBlog,

        onMutate: async (variables) => {

            const { blogId, status, slug } = variables;

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.MY_BLOGS(status)
            });

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            if (slug) {
                await queryClient.cancelQueries({
                    queryKey: QUERY_KEYS.BLOG(slug)
                });
            }

            const previousMyBlogs = queryClient.getQueryData(
                QUERY_KEYS.MY_BLOGS(status)
            );

            const previousBlogs = queryClient.getQueriesData({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });


            const singleBlog = slug
                ? queryClient.getQueryData(
                    QUERY_KEYS.BLOG(slug)
                )
                : null;

            //update the single blog  

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.BLOG(slug)
            });

            //update my blog list
            queryClient.setQueryData(
                QUERY_KEYS.MY_BLOGS(status),
                (oldData) => {

                    if (!oldData) return oldData;

                    return oldData.filter(
                        (blog) => blog._id !== blogId
                    );

                }
            );

            //update the home blog list
            queryClient.setQueriesData(
                {
                    queryKey: QUERY_KEYS.BLOGS_ROOT
                }
                ,

                (oldData) => {

                    if (!oldData) return oldData;

                    return oldData.filter(
                        (blog) => blog._id !== blogId
                    );

                }
            );

            return {
                previousMyBlogs,
                previousBlogs,
                singleBlog
            }

        },

        onError: (error, variables, context) => {

            context?.previousBlogs?.forEach(([key, data]) => {
                queryClient.setQueryData(
                    key, data
                )
            });

            if (context?.previousMyBlogs) {
                queryClient.setQueryData(
                    QUERY_KEYS.MY_BLOGS(variables.status),
                    context.previousMyBlogs
                );
            };

            if (context?.singleBlog) {
                queryClient.setQueryData(
                    QUERY_KEYS.BLOG(variables.slug),
                    context.singleBlog
                )
            };

            handleMutationError(error);

        },

        onSuccess: (data) => {
            data.message
        },

        onSettled: (data, error, variables, context) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MY_BLOGS_ROOT
            });

            if (variables.slug) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.BLOG(variables.slug)
                });

            }

        }

    })
};
//blogid+slug complete
export const useToggleLike = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleLike,

        onMutate: async (variables) => {

            const { blogId, slug } = variables;

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.LIKED_BLOGS
            });

            if (slug) {

                await queryClient.cancelQueries({
                    queryKey: QUERY_KEYS.BLOG(slug)
                });

            };

            const previousBlogs = queryClient.getQueriesData({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            const previousLiked = queryClient.getQueryData(
                QUERY_KEYS.LIKED_BLOGS
            );

            const singleBlog = queryClient.getQueryData(
                QUERY_KEYS.BLOG(slug)
            );

            // update the whole root blogs 

            queryClient.setQueriesData(
                {
                    queryKey: QUERY_KEYS.BLOGS_ROOT
                },

                (oldData) => {

                    if (!oldData) return oldData;

                    return oldData.map((blog) => {

                        return blog._id === blogId
                            ? {
                                ...blog,
                                isLiked: !blog.isLiked,
                                likesCount: blog.isLiked
                                    ? blog.likesCount - 1
                                    : blog.likesCount + 1
                            }

                            : blog
                    });
                }
            );

            // update the liked blog list

            if (previousLiked) {
                queryClient.setQueryData(
                    QUERY_KEYS.LIKED_BLOGS,

                    (oldData) => {

                        if (!oldData) return oldData;

                        return oldData.map((blog) => {

                            return blog._id === blogId
                                ? {
                                    ...blog,
                                    isLiked: !blog.isLiked,
                                    likesCount: blog.isLiked
                                        ? blog.likesCount - 1
                                        : blog.likesCount + 1
                                }

                                : blog
                        });

                    }
                )
            };

            //update the single blog

            if (singleBlog) {
                queryClient.setQueryData(
                    QUERY_KEYS.BLOG(slug),

                    (oldData) => {
                        return {
                            ...oldData,
                            isLiked: !oldData.isLiked,
                            likesCount: oldData.isLiked
                                ? oldData.likesCount - 1
                                : oldData.likesCount + 1
                        }
                    }
                )
            };

            return { previousBlogs, singleBlog, previousLiked }
        },

        onError: (error, variables, context) => {

            context?.previousBlogs?.forEach(([key, data]) => {
                queryClient.setQueryData(
                    key, data
                );
            });

            if (context?.previousLiked) {
                queryClient.setQueryData(
                    QUERY_KEYS.LIKED_BLOGS,
                    context.previousLiked
                )
            }

            if (context?.singleBlog) {
                queryClient.setQueryData(
                    QUERY_KEYS.BLOG(variables.slug),
                    context.singleBlog
                )
            };

            handleMutationError(error);

        },

        onSuccess: (data) => {
            data.message
        },

        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.LIKED_BLOGS
            });

            if (variables.slug) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.BLOG(variables.slug)
                });
            };

        }

    })

};
//blogid+slug complete
export const useToggleBookmark = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: toggleBookmark,

        onMutate: async (variables) => {

            const { blogId, slug } = variables;

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.BOOKMARKED_BLOGS
            });

            if (slug) {

                await queryClient.cancelQueries({
                    queryKey: QUERY_KEYS.BLOG(slug)
                });

            };

            const previousBookmarked = queryClient.getQueryData(
                QUERY_KEYS.BOOKMARKED_BLOGS
            );

            const previousBlogs = queryClient.getQueriesData({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            const singleBlog = queryClient.getQueryData(
                QUERY_KEYS.BLOG(slug)
            );

            // Update all blog lists

            queryClient.setQueriesData(
                {
                    queryKey: QUERY_KEYS.BLOGS_ROOT
                },

                (oldData) => {

                    if (!oldData) return oldData;

                    return oldData.map((blog) => {
                        return blog._id === blogId ?
                            {
                                ...blog,
                                isBookmarked: !blog.isBookmarked
                            } : blog
                    })

                }
            );

            if (singleBlog) {
                queryClient.setQueryData(
                    QUERY_KEYS.BLOG(slug),

                    (oldData) => {

                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            isBookmarked: !oldData.isBookmarked
                        }
                    }
                )
            };

            if (previousBookmarked) {
                queryClient.setQueryData(
                    QUERY_KEYS.BOOKMARKED_BLOGS,

                    (oldData) => {

                        if (!oldData) return oldData;

                        return oldData.map((blog) => {
                            return blog._id === blogId ?
                                {
                                    ...blog,
                                    isBookmarked: !blog.isBookmarked
                                } : blog
                        })

                    }
                )
            };

            return { singleBlog, previousBlogs, previousBookmarked }

        },

        onError: (error, variables, context) => {

            context?.previousBlogs?.forEach(
                ([key, data]) => {
                    queryClient.setQueryData(
                        key,
                        data
                    )
                }
            );


            if (context?.previousBookmarked) {
                queryClient.setQueryData(
                    QUERY_KEYS.BOOKMARKED_BLOGS,
                    context.previousBookmarked
                )
            };

            if (context?.singleBlog) {
                queryClient.setQueryData(
                    QUERY_KEYS.BLOG(variables.slug),
                    context.singleBlog
                )
            };

            handleMutationError(error);

        },

        onSuccess: (data) => {
            data.message
        },

        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.BOOKMARKED_BLOGS
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.BLOGS_ROOT
            });

            if (variables.slug) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.BLOG(variables.slug)
                });
            };

        }

    });

};
