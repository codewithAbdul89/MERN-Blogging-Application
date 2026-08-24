import User from "../models/user.model.js";
import { generateRefreshToken } from "../Services/auth.service.js";

const oauthLoginHelper = async ({ email, userName, picture, provider }) => {
  let user = await User.findOne({ email });

  // Create user if not exists
  if (!user) {
    const userData = {
      userName,
      email,
      authProviders: [provider],
      isEmailVerified: true,
    };

    if (picture) {
      userData.profilePic = {
        url: picture,
      };
    }

    user = await User.create(userData);
  } else {
    if (!user.authProviders.includes(provider)) {
      user.authProviders.push(provider);
    }

    user.isEmailVerified = true;

    await user.save();
  }

  // Update Google/GitHub profile
  if (user.authProviders.includes(provider)) {
    let isModified = false;

    if (user.userName !== userName) {
      user.userName = userName;
      isModified = true;
    }

    if (picture && user.profilePic?.url !== picture) {
      user.profilePic.url = picture;
      isModified = true;
    }

    if (isModified) {
      await user.save();
    }
  }

  const loggedInUser = user.toObject();

  delete loggedInUser.password;

  const refreshToken = generateRefreshToken(loggedInUser);

  return { refreshToken, loggedInUser };
};

export default oauthLoginHelper;
