export const normalizeBlogTags = (req, res, next) => {
  if (typeof req.body.tags === "string") {
    req.body.tags = [req.body.tags];
  }

  next();
};
