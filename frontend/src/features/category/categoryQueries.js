import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { getAllCategories, getPopulatedCategories } from "./categoryService.js";

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,

    queryFn: getAllCategories,
  });
};

export const usePopularCategory = () => {
  return useQuery({
    queryKey: ["popular_categories"],
    queryFn: getPopulatedCategories,
  });
};

// import { useQueryClient } from "@tanstack/react-query";

// const EditCategory = ({ categoryId }) => {

//     const queryClient = useQueryClient();

//     const category = queryClient
//         .getQueryData(QUERY_KEYS.CATEGORIES)
//         ?.categories
//         ?.find(category => category._id === categoryId);

//     return (
//         <form>
//             <input
//                 defaultValue={category?.name}
//             />
//         </form>
//     );
// };
