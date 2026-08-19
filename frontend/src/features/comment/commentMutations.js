import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createComment,
    updateComment,
    deleteComment,
    pinComment,
    hideComment
} from "./commentService.js";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { handleMutationError } from "../../utils/errorHandler.js";
import { showSuccess } from "../../utils/toast.js";


// blogId, commentData
export const useCreateComment = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createComment,

        onError: handleMutationError,

        onSuccess: (data, variables) => {
            //It invalidate all the comments whose blogId are same
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.COMMENTS(
                    variables.blogId
                )
            });

            showSuccess(data.message)

        }

    });

};

 
// commentId, commentData
export const useUpdateComment = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateComment,

        onError: handleMutationError,

        onSuccess: (data, variables) => {

            //if updating the reply

            if (variables.parentCommentId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.REPLIES(
                        variables.parentCommentId
                    )
                });

            }

            //if updating the parent one

            else if (variables.blogId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.COMMENTS(
                        variables.blogId
                    )
                });

            }

            showSuccess(data.message)

        }

    });

};


// commentId
export const useDeleteComment = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteComment,

        onError: handleMutationError,

        onSuccess: (data, variables) => {

            //if updating the reply

            if (variables.parentCommentId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.REPLIES(
                        variables.parentCommentId
                    )
                });

            }

            //if updating the reply

            else if (variables.blogId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.COMMENTS(
                        variables.blogId
                    )
                });

            }

            showSuccess(data.message);

        }

    });

};


// commentId
export const usePinComment = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: pinComment,

        onError: handleMutationError,

        onSuccess: (data, variables) => {

            // //if updating the reply

            if (variables.parentCommentId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.REPLIES(
                        variables.parentCommentId
                    )
                });

            }

            //if updating the reply

            else if (variables.blogId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.COMMENTS(
                        variables.blogId
                    )
                });

            }

            showSuccess(data.message);

        }

    });

};


// commentId
export const useHideComment = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: hideComment,

        onError: handleMutationError,

        onSuccess: (data, variables) => {

            //if updating the reply

            if (variables.parentCommentId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.REPLIES(
                        variables.parentCommentId
                    )
                });

            }

            //if updating the reply

            else if (variables.blogId) {

                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.COMMENTS(
                        variables.blogId
                    )
                });

            }

            showSuccess(data.message);

        }

    });

};