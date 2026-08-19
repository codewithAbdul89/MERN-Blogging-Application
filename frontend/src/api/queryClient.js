import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retryDelay: 1000,
            refetchOnWindowFocus: true,
            retry: (failureCount, error) => {

                const status = error.response?.status;

                // Don't retry client errors
                if (status >= 400 && status < 500) {
                    return false;
                }

                // Retry network/server errors twice
                return failureCount < 2;
            }
        }
    }
});

export default queryClient;

