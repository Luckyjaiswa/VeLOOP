// Custom centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for internal monitoring (avoid leaking raw stack traces to user)
  console.error(`[Error Handler] ${req.method} ${req.url} ->`, err.message || err);

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    const message = 'The requested resource was not found or has an invalid identifier.';
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    let field = 'resource';
    if (err.keyValue) {
      field = Object.keys(err.keyValue)[0];
    }
    const message =
      field === 'email'
        ? 'An account with this email address already exists. Please login instead.'
        : 'This streak reward was already claimed or a duplicate request was detected.';
    return res.status(400).json({ success: false, message, code: 'DUPLICATE_ENTRY' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ success: false, message, code: 'VALIDATION_ERROR' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token. Please login again.',
      code: 'AUTH_INVALID',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please log in again to continue.',
      code: 'AUTH_EXPIRED',
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again later.',
    code: err.code || 'SERVER_ERROR',
  });
};

// 404 Route Not Found handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist on this VELoop server.`,
  });
};

module.exports = { errorHandler, notFoundHandler };
