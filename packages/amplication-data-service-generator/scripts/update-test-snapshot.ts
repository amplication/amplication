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
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
