/**
 * Copy static files to destination folder to be available
 */

import * as path from "path";
import * as fs from "fs";
import fg from "fast-glob";
import normalize from "normalize-path";

const SRC_DIRECTORY = path.join(__dirname, "..", "src");
const DIST_DIRECTORY = path.join(__dirname, "..", "dist");

async function copyFiles() {
  const templatesPaths = await fg(
    `${normalize(SRC_DIRECTORY)}/**/*.template.ts`
  );
  if (templatesPaths.length === 0) {
    throw new Error("At least one template file must match");
  }
  const staticPaths = await fg(`${normalize(SRC_DIRECTORY)}/static/**`, {
    dot: true,
  });
  if (staticPaths.length === 0) {
    throw new Error("At least one static file must match");
  }
  const paths = [...templatesPaths, ...staticPaths];
  await Promise.all(
    paths.map(async (filePath) => {
      const normalizedFilePath = path.normalize(filePath);
      const dest = normalizedFilePath.replace(SRC_DIRECTORY, DIST_DIRECTORY);
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.copyFile(normalizedFilePath, dest);
    })
  );
}

copyFiles().catch((error) => {
  console.error(error);
  process.exit(1);
});
