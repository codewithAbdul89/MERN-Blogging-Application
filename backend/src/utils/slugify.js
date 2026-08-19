
export const slugify = (name, id = "") => {
    const uniqueNumbers = id.toString().slice(0, 4);
    const slug = name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .join("-")
        + uniqueNumbers
    return slug
};