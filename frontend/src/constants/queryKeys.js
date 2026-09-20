export const QUERY_KEYS = {
  // Home page infinite feed
  HOME_BLOGS: ["homeBlogs"],

  SEARCH_BLOGS: (params = {}) => ["blogs", "search", params],

  SEARCH_BLOGS_ROOT: ["blogs", "search"],

  // Single blog
  BLOG: (slug) => ["blog", slug],

  // My blogs
  MY_HOME_BLOGS: ["myBlogs"],

  MY_BLOGS: (status = "ALL") => ["myBlogs", status],

  // User interactions
  LIKED_BLOGS: ["likedBlogs"],

  BOOKMARKED_BLOGS: ["bookmarkedBlogs"],

  blogStats: ["blogStats"],

  // Comments
  COMMENTS: (blogId) => ["comments", blogId],
  //REPLIES

  REPLIES: (parentCommentId) => ["replies", parentCommentId],

  // Categories
  CATEGORIES: ["categories"],

  // User

  CURRENT_USER: ["currentUser"],
};
