export const accessTokenOptions = {
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenOptions = (rememberMe) => ({
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",

  ...(rememberMe && {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }),
});
