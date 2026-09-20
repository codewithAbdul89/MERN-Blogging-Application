export const slugify = (name, id = "") => {
  const uniqueNumbers = id.toString().slice(0, 4);

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${slug}-${uniqueNumbers}`;
};