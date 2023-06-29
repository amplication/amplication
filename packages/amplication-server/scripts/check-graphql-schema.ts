import * as fs from "fs";
import * as path from "path";
import { diff } from "jest-diff";
import generateGraphQLSchema from "./generate-graphql-schema";
import { Logger } from "@amplication/util/logging";

const SCHEMA_PATH = path.join(__dirname, "..", "src", "schema.graphql");
const logger = new Logger({
  isProduction: false,
  component: "check-graphql-schema",
});
function readGraphQLSchema(): Promise<string> {
  return fs.promises.readFile(SCHEMA_PATH, "utf-8");
}

async function checkGraphQLSchema() {
  const existingSchema = await readGraphQLSchema();
  await generateGraphQLSchema();
  const generatedSchema = await readGraphQLSchema();
  await fs.promises.writeFile(SCHEMA_PATH, existingSchema);
  if (existingSchema !== generatedSchema) {
    logger.info(diff(existingSchema, generatedSchema));
    throw new Error("Generated schema does not match the existing schema");
  }
}

if (require.main === module) {
  checkGraphQLSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error.message, error);
      process.exit(1);
    });
}
