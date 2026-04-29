const app = require("./app");
const prisma = require("./prisma");
const { env } = require("./config/env");

const server = app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("unhandledRejection", async (error) => {
  console.error("Unhandled rejection:", error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught exception:", error);
  await prisma.$disconnect();
  process.exit(1);
});
