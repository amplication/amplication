/**
 * Copy static files to destination folder to be available
 */

import * as fs from "fs";
import fg from "fast-glob";

async function copyFiles() {
  const templatesPaths = await fg("src/**/templates/*");
  const staticPaths = await fg("src/static/**");
  const paths = [...templatesPaths, ...staticPaths];
  await Promise.all(
    paths.map((path) => {
      const dest = path.replace(/^src/, "dist");
      return fs.promises.copyFile(path, dest);
    })
  );
}

copyFiles().catch((error) => {
  console.error(error);
  process.exit(1);
});
