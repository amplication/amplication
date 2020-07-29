/**
 * Copy static files to destination folder to be available
 */

import * as path from "path";
import * as fs from "fs";
import fg from "fast-glob";

const SRC_DIRECTORY = path.join(__dirname, "..", "src");
const DIST_DIRECTORY = path.join(__dirname, "..", "dist");
const SRC_DIRECTORY_REGEXP = new RegExp("^" + SRC_DIRECTORY);

async function copyFiles() {
  const templatesPaths = await fg(`${SRC_DIRECTORY}/**/templates/*`);
  const staticPaths = await fg(`${SRC_DIRECTORY}/static/**`);
  const paths = [...templatesPaths, ...staticPaths];
  await Promise.all(
    paths.map(async (filePath) => {
      const dest = filePath.replace(SRC_DIRECTORY_REGEXP, DIST_DIRECTORY);
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.copyFile(filePath, dest);
    })
  );
}

copyFiles().catch((error) => {
  console.error(error);
  process.exit(1);
});
