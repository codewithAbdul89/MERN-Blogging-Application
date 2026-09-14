import { useEffect, useRef } from "react";

function useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }) {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return loadMoreRef;
}

export default useInfiniteScroll;
