/**
 * Script for updating src/tests/expected/ directory
 */

import * as path from "path";
import * as fs from "fs";
import { createDataService, Entity } from "..";
import entities from "../src/tests/entities.json";

const EXPECTED_DIRECTORY = path.join(
  __dirname,
  "..",
  "src",
  "tests",
  "expected"
);

updatedExpected()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function updatedExpected() {
  const modules = await createDataService(entities as Entity[]);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = path.join(EXPECTED_DIRECTORY, module.path);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, module.code);
    })
  );
}
