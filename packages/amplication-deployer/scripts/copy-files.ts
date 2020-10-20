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
  const paths = await fg(`${normalize(SRC_DIRECTORY)}/**/*.tf`);
  if (paths.length === 0) {
    throw new Error("At least one file must match");
  }
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
