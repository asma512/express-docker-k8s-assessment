const extractMongooseError = (err) => {
  if (err && err.name === 'ValidationError') {
    return Object.values(err.errors).map((field) => field.message).join(', ');
  }

  if (err && err.name === 'CastError') {
    return `Invalid value for ${err.path}`;
  }

  return err.message || 'Internal Server Error';
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const isValidationError = err && (err.name === 'ValidationError' || err.name === 'CastError');

  res.status(isValidationError ? 400 : statusCode).json({
    message: extractMongooseError(err),
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
