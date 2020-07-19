import * as path from "path";
import { createApp } from "../../create-app";
import * as api from "./api.json";

Error.stackTraceLimit = Infinity;

createApp(api, path.join(__dirname, "..", "dist")).catch((error) => {
  console.error(error);
  process.exit(1);
});
