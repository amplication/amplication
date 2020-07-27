const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

client.user
  .create({ data: { username: "alice", password: "password" } })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
