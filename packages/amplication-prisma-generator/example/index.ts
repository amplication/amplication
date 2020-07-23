import * as fs from "fs";
import * as path from "path";
import entities from "./entities.json";
import { createPrismaSchema } from "..";

const schema = createPrismaSchema(entities);

fs.writeFileSync(
  path.resolve(__dirname, "dist", "schema.prisma"),
  schema,
  "utf-8"
);
