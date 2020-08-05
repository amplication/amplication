/**
 * Script for updating the src/tests/expected/ directory
 */

import * as path from "path";
import generateTestDataService from "./generate-test-data-service";

const EXPECTED_DIRECTORY = path.join(
  __dirname,
  "..",
  "src",
  "tests",
  "expected"
);

generateTestDataService(EXPECTED_DIRECTORY)
  .then(() => {
    const cwd = process.cwd();
    const directory = `${path.relative(cwd, EXPECTED_DIRECTORY)}${path.sep}`;
    console.log(`Updated successfully: ${directory}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
