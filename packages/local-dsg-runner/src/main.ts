import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import codeGenRouter from "./code-gen/code-gen.router";

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to local-dsg-runner!" });
});

app.use("/api/code-generate", codeGenRouter);

const port = process.env.port || 8900;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
