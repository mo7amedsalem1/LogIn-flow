const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const { env } = require("./config/env");

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = global.__prisma__ || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}

module.exports = prisma;
