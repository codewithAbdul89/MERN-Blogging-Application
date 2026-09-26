// export const accessTokenOptions = {
//   sameSite: "lax",
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   maxAge: 15 * 60 * 1000,
// };

// export const refreshTokenOptions = (rememberMe) => ({
//   sameSite: "lax",
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",

//   ...(rememberMe && {
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   }),
// });

export const accessTokenOptions = {
  sameSite: "none",
  httpOnly: true,
  secure: true,
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenOptions = (rememberMe) => ({
  sameSite: "none",
  httpOnly: true,
  secure: true,

  ...(rememberMe && {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }),
});
