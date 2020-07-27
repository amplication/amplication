const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

client.user
  .create({ data: { username: "alice", password: "password" } })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
