import codeGenRouter from "./code-gen/code-gen.router";
import * as dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(express.json());

app.use("/api/code-generate", codeGenRouter);

const port = process.env.PORT || 8888;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
