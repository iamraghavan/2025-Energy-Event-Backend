const errorHandler = (err, req, res, next) => {
  // Defensive: default to 500 if not explicitly set
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Optional: standard error payload shape
  const errorResponse = {
    status: 'error',
    message: err.message || 'Internal server error',
  };

  // Include stack trace only in non-production for easier debugging
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack || 'No stack trace available';
    errorResponse.path = req.originalUrl;
    errorResponse.method = req.method;
  }

  // Log unexpected errors for audit (but avoid console spam in prod)
  if (statusCode >= 500) {
    console.error(`[ERROR_HANDLER] ${err.message}`, {
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
