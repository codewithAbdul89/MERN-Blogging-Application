// src/constants/queryKeys.js

export const QUERY_KEYS = {
  // Home page infinite feed
  HOME_BLOGS: ["homeBlogs"],

  SEARCH_BLOGS: (params) => ["searchBlogs", params],

  // Single blog
  BLOG: (slug) => ["blog", slug],

  // My blogs
  MY_HOME_BLOGS: ["myBlogs"],

  MY_BLOGS: (status) => ["myBlogs", status],

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
