const { ZodError } = require("zod");

const { env } = require("../config/env");

const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.flatten().fieldErrors,
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON payload",
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return res.status(statusCode).json({
    message:
      statusCode >= 500 && env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
    ...(error.details ? { details: error.details } : {}),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
