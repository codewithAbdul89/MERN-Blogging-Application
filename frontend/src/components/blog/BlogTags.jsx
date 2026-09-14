import { useState } from "react";

function BlogTags({ tags = [] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleTags = showAll ? tags : tags.slice(0, 2);

  const remainingCount = tags.length - visibleTags.length;

  return (
    <ul className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
        >
          # {tag}
        </li>
      ))}

      {!showAll && remainingCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="cursor-pointer rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary sm:hidden"
        >
          +{remainingCount}
        </button>
      )}
    </ul>
  );
}

export default BlogTags;