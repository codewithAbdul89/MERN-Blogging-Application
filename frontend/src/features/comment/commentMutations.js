import { Query, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createComment,
  // updateComment,
  deleteComment,
  pinComment,
  // hideComment,
} from "./commentService.js";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { showSuccess } from "../../utils/toast.js";
import Replies from "../../pages/comment/Replies.jsx";

// blogId, commentData
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,

    onError: errorHandler,

    onSuccess: (data) => {
      //It invalidate all the comments whose blogId are same
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });
      queryClient.invalidateQueries({
        queryKey: ["blogs", "single"],
      });

      showSuccess(data.message);
    },
  });
};

// commentId
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,

    onMutate: async (variables) => {
      const { commentId } = variables;

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });

      const previousComments = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });
      const previousReplies = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });

      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.COMMENTS_ROOT,
        },

        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                comments: page.data.comments.filter((comment) => comment._id !== commentId),
              },
            })),
          };
        }
      );

      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.REPLIES_ROOT,
        },

        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                replies: page.data.replies.filter((reply) => reply._id !== commentId),
              },
            })),
          };
        }
      );

      return {
        previousComments,
        previousReplies,
      };
    },

    onError: (error, variables, context) => {
      context?.previousComments?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      context?.previousReplies?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      errorHandler(error);
    },

    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SINGLE_BLOG_ROOT,
      });
      showSuccess(data.message);
    },
  });
};

// commentId
export const usePinComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pinComment,

    onMutate: async (variables) => {
      const { commentId } = variables;

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });

      const previousComments = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });

      queryClient.setQueriesData(
        {
          queryKey: QUERY_KEYS.COMMENTS_ROOT,
        },

        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                comments: page.data.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        isPinned: !comment.isPinned,
                      }
                    : comment
                ),
              },
            })),
          };
        }
      );

      return {
        previousComments,
      };
    },

    onError: (error, variables, context) => {
      context?.previousComments?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      errorHandler(error);
    },

    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });
      showSuccess(data.message);
    },
  });
};

// commentId, commentData
// export const useUpdateComment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateComment,

//     onError: errorHandler,

//     onSuccess: (data, variables) => {
//       //if updating the reply

//       if (variables.parentCommentId) {
//         queryClient.invalidateQueries({
//           queryKey: QUERY_KEYS.REPLIES(variables.parentCommentId),
//         });
//       }

//       //if updating the parent one
//       else if (variables.blogId) {
//         queryClient.invalidateQueries({
//           queryKey: QUERY_KEYS.COMMENTS(variables.blogId),
//         });
//       }

//       showSuccess(data.message);
//     },
//   });
// };

// commentId
// export const useHideComment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: hideComment,

//     onError: errorHandler,

//     onSuccess: (data, variables) => {
//       //if updating the reply

//       if (variables.parentCommentId) {
//         queryClient.invalidateQueries({
//           queryKey: QUERY_KEYS.REPLIES(variables.parentCommentId),
//         });
//       }

//       //if updating the reply
//       else if (variables.blogId) {
//         queryClient.invalidateQueries({
//           queryKey: QUERY_KEYS.COMMENTS(variables.blogId),
//         });
//       }

//       showSuccess(data.message);
//     },
//   });
// };
