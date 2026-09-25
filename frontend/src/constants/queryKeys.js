export const QUERY_KEYS = {
  // CURRENT USER

  CURRENT_USER: ["currentUser"],

  // BLOGS ROOT

  BLOGS_ROOT: ["blogs"],

  // HOME BLOGS Infinite home feed

  HOME_BLOGS: ["blogs", "home"],

  // SINGLE BLOG

  BLOG: (slug) => ["blogs", "single", slug],
  SINGLE_BLOG_ROOT: () => ["blogs", "single"],

  // MY BLOGS

  MY_BLOGS_ROOT: ["blogs", "mine"],

  MY_BLOGS: (status = "ALL") => ["blogs", "mine", status],

  // LIKED BLOGS

  LIKED_BLOGS: ["blogs", "liked"],

  // BOOKMARKED BLOGS

  BOOKMARKED_BLOGS: ["blogs", "bookmarked"],

  // SEARCH BLOGS

  SEARCH_BLOGS_ROOT: ["blogs", "search"],

  SEARCH_BLOGS: (params = {}) => ["blogs", "search", params],

  // BLOG STATS

  BLOG_STATS: ["BLOG_STATS"],

  // COMMENTS

  COMMENTS_ROOT: ["comments"],

  COMMENTS: (blogId) => ["comments", blogId],

  // REPLIES

  REPLIES_ROOT: ["replies"],

  REPLIES: (parentCommentId) => ["replies", parentCommentId],

  // CATEGORIES

  CATEGORIES: ["categories"],

  // USERS

  USERS_PROFILE_ROOT: ["users", "profile"],

  USER_PROFILE: (userId) => ["users", "profile", userId],

  // loctions

  countries: ["location", "countries"],

  states: (countryCode) => ["location", "states", countryCode],

  cities: (countryCode, stateCode) => ["location", "cities", countryCode, stateCode],
};
