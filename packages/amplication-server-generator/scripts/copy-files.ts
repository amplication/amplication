/**
 * Copy static files to destination folder to be available
 */

import * as path from "path";
import * as fs from "fs";
import fg from "fast-glob";

const SRC_DIRECTORY = path.join(__dirname, "..", "src");
const DIST_DIRECTORY = path.join(__dirname, "..", "dist");

async function copyFiles() {
  const templatesPaths = await fg(`${SRC_DIRECTORY}/**/templates/*`);
  const staticPaths = await fg(`${SRC_DIRECTORY}/static/**`);
  const paths = [...templatesPaths, ...staticPaths];
  await Promise.all(
    paths.map((path) => {
      const dest = path.replace(
        new RegExp("^" + SRC_DIRECTORY),
        DIST_DIRECTORY
      );
      return fs.promises.copyFile(path, dest);
    })
  );
}

copyFiles().catch((error) => {
  console.error(error);
  process.exit(1);
});
