/* eslint-disable no-unused-vars */
export const errorHandler = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: 'This route does not exist' });
  });
  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error('ERROR', req.method, req.path, err);

    // expired token
    if (err.name === 'UnauthorizedError' && !res.headersSent) {
      res.status(401).json({ message: 'Invalid token' });
    }

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};
