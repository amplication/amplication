import express = require("express");
import { PrismaClient } from "@prisma/client";
import * as server from "./server";
import * as customers from "./customers.json";

const app = express();
app.use(express.json());
const client = new PrismaClient();
server.registerEntityService(app, customers, client);
const port = 8000;
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
