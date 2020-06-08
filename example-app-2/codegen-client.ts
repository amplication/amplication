import { PrismaClient } from "@prisma/client";
import { codegen } from "./codegen";
import * as customers from "./customers.json";

const client = new PrismaClient();

codegen(customers, client);
