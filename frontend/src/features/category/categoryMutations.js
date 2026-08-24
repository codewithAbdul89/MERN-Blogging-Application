import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createCategory,
    deleteCategory,
    updateCategory
} from "./categoryService.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { showSuccess } from "../../utils/toast.js";

export const useCreateCategory = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createCategory,

        onError: errorHandler,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CATEGORIES
            });

            showSuccess(data.message)
        }

    })
};

export const useUpdateCategory = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateCategory,

        onError: errorHandler,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CATEGORIES
            })

            showSuccess(data.message)

        }

    })
};
// categoryId, categoryData
export const useDeleteCategory = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteCategory,

        onError: errorHandler,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CATEGORIES
            })

            showSuccess(data.message)

        }

    })
};
