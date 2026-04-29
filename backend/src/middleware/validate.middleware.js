const { AppError } = require("../utils/app-error");

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(
      new AppError(400, "Validation failed", result.error.flatten().fieldErrors),
    );
  }

  req.body = result.data.body;
  req.params = result.data.params;
  req.query = result.data.query;
  return next();
};

module.exports = validate;
