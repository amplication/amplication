import fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import { compileFromFile } from "json-schema-to-typescript";
import normalize from "normalize-path";

const SRC_DIRECTORY = path.join(__dirname, "..", "src");
const SCHEMAS_DIRECTORY = path.join(SRC_DIRECTORY, "schemas");
const TYPES_DIRECTORY = path.join(SRC_DIRECTORY, "types");

if (require.main === module) {
  generateTypes().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function generateTypes() {
  const schemaGrep = normalize(path.join(SCHEMAS_DIRECTORY, "**", "*.json"));
  const schemaFiles = await fg(schemaGrep, {
    objectMode: true,
  });
  if (schemaFiles.length === 0) {
    throw new Error(`No schema files were found for ${schemaGrep}`);
  }
  await fs.promises.mkdir(TYPES_DIRECTORY, { recursive: true });
  await Promise.all(
    schemaFiles.map(async ({ name, path: filePath }) =>
      generateTypeFile(filePath, name)
    )
  );
  const code = schemaFiles
    .map(({ name }) => `export * from "./${name.replace(".json", "")}"`)
    .join("\n");
  const indexPath = path.join(TYPES_DIRECTORY, "index.ts");
  await fs.promises.writeFile(indexPath, code);
  console.info(
    `Successfully written to ${path.relative(process.cwd(), TYPES_DIRECTORY)}`
  );
}

async function generateTypeFile(filePath: string, name: string) {
  const code = await compileFromFile(filePath);
  const tsPath = path.join(TYPES_DIRECTORY, name.replace(".json", ".ts"));
  await fs.promises.writeFile(tsPath, code);
}
