import { PrismaClient } from "@prisma/client";
import { codegen } from "./codegen";
import * as api from "./api.json";

const client = new PrismaClient();

codegen(api, client);
