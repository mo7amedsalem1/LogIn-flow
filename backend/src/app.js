const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const accessRoutes = require("./routes/access.routes");
const { apiLimiter } = require("./middleware/rate-limit.middleware");
const { AppError } = require("./utils/app-error");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new AppError(403, "Origin not allowed by CORS"));
    },
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(apiLimiter);

if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", accessRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
