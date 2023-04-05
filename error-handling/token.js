const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function refreshAccessToken(refreshToken) {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.sub);

    // If the user doesn't exist or has revoked their refresh token, return null
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return null;
    }

    // Generate a new access token
    const accessToken = jwt.sign({ sub: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "12h",
    });

    // Return the new access token
    return accessToken;
  } catch (error) {
    // If the refresh token is invalid or has expired, return null
    return null;
  }
}

module.exports = {
  refreshAccessToken,
};
