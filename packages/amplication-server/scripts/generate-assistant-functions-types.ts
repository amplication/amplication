import fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import { compile } from "json-schema-to-typescript";
import normalize from "normalize-path";
import { format } from "prettier";

const SRC_DIRECTORY = path.join(__dirname, "..", "src");
const SCHEMAS_DIRECTORY = path.join(
  SRC_DIRECTORY,
  "core",
  "assistant",
  "functions"
);
const TYPES_DIRECTORY = path.join(SCHEMAS_DIRECTORY, "types");

if (require.main === module) {
  generateTypes().catch((error) => {
    // eslint-disable-next-line no-console
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
    .map(({ name }) => `export * from "./${name.replace(".json", ".types")}";`)
    .join("\n");

  const indexPath = path.join(TYPES_DIRECTORY, "index.ts");
  await fs.promises.writeFile(
    indexPath,
    format(code, { parser: "typescript" })
  );
  // eslint-disable-next-line no-console
  console.info(
    `Successfully written to ${path.relative(process.cwd(), TYPES_DIRECTORY)}`
  );
}

async function generateTypeFile(filePath: string, name: string) {
  //read file content as json and extract the parameters property
  const value = await fs.promises.readFile(filePath, "utf-8");
  const content = JSON.parse(value);

  //generate the typescript code for the parameters property

  const code = await compile(content.parameters, name.replace(".json", ""), {
    additionalProperties: false,
  });
  const tsPath = path.join(TYPES_DIRECTORY, name.replace(".json", ".types.ts"));
  await fs.promises.writeFile(tsPath, format(code, { parser: "typescript" }));
}
