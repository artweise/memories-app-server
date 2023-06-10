import { config } from 'dotenv';
import { expressjwt as jwt } from 'express-jwt';

// to access the .env
config();

// Function used to extract the JWT token from the request's 'Authorization' Headers
const getTokenFromHeaders = (req) => {
  // Check if the token is available on the request Headers
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }

  return null;
};

// Instantiate the JWT token validation middleware
export const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
  onExpired: async (req, err) => {
    if (new Date() - err.inner.expiredAt < 5000) {
      return;
    }
    throw err;
  },
});
