import * as path from "path";
import { codegen } from "../../codegen";
import * as api from "./api.json";

Error.stackTraceLimit = Infinity;

codegen(api, path.join(__dirname, "..", "dist")).catch((error) => {
  console.error(error);
  process.exit(1);
});
