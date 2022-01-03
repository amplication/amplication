import fs from "fs";
import { join, relative } from "path";
import fg, { Entry } from "fast-glob";
import { compileFromFile } from "json-schema-to-typescript";
import normalize from "normalize-path";

const SRC_DIRECTORY = join(__dirname, "..", "src");
const SCHEMAS_DIRECTORY = join(SRC_DIRECTORY, "schemas");
const TYPES_DIRECTORY = join(SRC_DIRECTORY, "types");

if (require.main === module) {
  generateTypes().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function generateTypes() {
  const schemaGrep = normalize(join(SCHEMAS_DIRECTORY, "**", "*.json"));
  const schemaFiles = await fg(schemaGrep, {
    objectMode: true,
  });
  if (schemaFiles.length === 0) {
    throw new Error(`No schema files were found for ${schemaGrep}`);
  }
  await fs.promises.mkdir(TYPES_DIRECTORY, { recursive: true });
  const typesFiles = await Promise.all(
    schemaFiles.map(async ({ name, path: filePath }) =>
      generateTypeFile(filePath, name)
    )
  );
  for await (const { code, path } of typesFiles) {
    await fs.promises.writeFile(path, code);
  }
  await createTypesIndexFile(schemaFiles);
  console.info(
    `Successfully written to ${relative(process.cwd(), TYPES_DIRECTORY)}`
  );
}

export async function generateTypeFile(filePath: string, name: string) {
  const code = await compileFromFile(filePath);
  const tsPath = join(TYPES_DIRECTORY, name.replace(".json", ".ts"));
  return { path: tsPath, code };
}

async function createTypesIndexFile(schemaFiles: Entry[]): Promise<void> {
  const code = schemaFiles
    .map(({ name }) => `export * from "./${name.replace(".json", "")}"`)
    .join("\n");
  const indexPath = join(TYPES_DIRECTORY, "index.ts");
  await fs.promises.writeFile(indexPath, code);
  return;
}
