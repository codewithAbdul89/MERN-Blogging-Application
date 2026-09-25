function BlogTags({ tags = [], showAllTags = false }) {
  const visibleTags = showAllTags ? tags : tags.slice(0, 2);

  const remainingCount = tags.length - visibleTags.length;

  return (
    <ul
      className={`flex  gap-2 ${showAllTags ? "flex-wrap" : "flex-wrap md:flex-nowrap overflow-clip"}`}
    >
      {visibleTags.map((tag) => (
        <li
          key={tag}
          className={`border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1 text-sm ${showAllTags ? "" : "whitespace-nowrap"}`}
        >
          # {tag}
        </li>
      ))}

      {!showAllTags && remainingCount > 0 && (
        <div className="border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1 text-sm">
          +{remainingCount}
        </div>
      )}
    </ul>
  );
}

export default BlogTags;
