const { expressjwt: jwt } = require("express-jwt");
const { refreshAccessToken } = require("../error-handling/token");

// Instantiate the JWT token validation middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
    });
    req.payload = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        // Attempt to refresh the access token using the refresh token
        const newToken = await refreshAccessToken(req.payload.refreshToken);
        // Set the new access token on the response header
        res.setHeader("Authorization", `Bearer ${newToken}`);
        // Set the new token in the request payload
        req.payload.token = newToken;
        next();
      } catch (err) {
        // Unable to refresh token, return an error response
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      // Token verification failed for some other reason, return an error response
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
};

// Instantiate the JWT token validation middleware
// const isAuthenticated = jwt({
//   secret: process.env.TOKEN_SECRET,
//   algorithms: ["HS256"],
//   requestProperty: "payload",
//   getToken: getTokenFromHeaders,
//   onExpired: async (req, err) => {
//     if (new Date() - err.inner.expiredAt < 5000) {
//       return;
//     }
//     throw err;
//   },
// });

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
};

// const jwt = require('jsonwebtoken');
// const secret = 'your-secret-key';

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Token missing' });
//   }

//   try {
//     const decodedToken = jwt.verify(token, secret);
//     req.user = decodedToken.user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// app.use('/protected', authMiddleware, (req, res) => {
//   // Handle authenticated requests
// });
