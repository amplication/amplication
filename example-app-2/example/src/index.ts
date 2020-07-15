import * as path from "path";
import { codegen } from "../../codegen";
import * as api from "./api.json";

codegen(api, path.join(__dirname, "..", "dist"));
