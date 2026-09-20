import { twMerge } from "tailwind-merge";
import { CATEGORY_STYLES } from "../../constants/categoryStyles";

function CategoryBadge({ category, className = "" }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;

  return (
    <span
      className={twMerge(
        `
        inline-flex items-center
        rounded-full
        border
        whitespace-nowrap
        px-2.5 py-1 md:px-4
        text-xs font-medium
        ${style.bg}
        text-white`,
        className,
      )}
    >
      {category}
    </span>
  );
}

export default CategoryBadge;
