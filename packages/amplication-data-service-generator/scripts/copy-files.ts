/**
 * Copy static files to destination folder to be available
 */

import * as path from "path";
import * as fs from "fs";
import fg from "fast-glob";
import normalize from "normalize-path";

/** The directory of the source code */
const SRC_DIRECTORY = path.join(__dirname, "..", "src");
/** The directory of the compiled code */
const DIST_DIRECTORY = path.join(__dirname, "..", "dist");
/*** The directory of the server source code */
const SERVER_SRC_DIRECTORY = path.join(SRC_DIRECTORY, "server");
/*** The directory of the admin source code */
const ADMIN_SRC_DIRECTORY = path.join(SRC_DIRECTORY, "admin");
const SRC_DIRECTORY_GLOB = normalize(SRC_DIRECTORY);
const SERVER_SRC_DIRECTORY_GLOB = normalize(SERVER_SRC_DIRECTORY);
const ADMIN_SRC_DIRECTORY_GLOB = normalize(ADMIN_SRC_DIRECTORY);
/** The globs to copy from to DIST_DIRECTORY */
const GLOB_SOURCES: string[] = [
  `${SRC_DIRECTORY_GLOB}/static/**`,
  `${SERVER_SRC_DIRECTORY_GLOB}/**/*.template.ts`,
  `${SERVER_SRC_DIRECTORY_GLOB}/static/**`,
  `${ADMIN_SRC_DIRECTORY_GLOB}/**/*.template.(ts|tsx|html)`,
  `${ADMIN_SRC_DIRECTORY_GLOB}/static/**`,
];

if (require.main === module) {
  void copyFiles().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function copyFiles(): Promise<void> {
  // Get a full list of files to copy
  const filePathsList = await Promise.all(
    GLOB_SOURCES.map(async (source) => {
      const paths = await fg([source], {
        dot: true,
        ignore: ["**/node_modules/**"],
      });
      if (paths.length === 0) {
        throw new Error(`At least one file must match ${source}`);
      }
      return paths;
    })
  );
  // @ts-ignore
  const filePaths = filePathsList.flat();
  // Copy all matching files to dist
  await Promise.all(
    filePaths.map(async (filePath: string) => {
      const normalizedFilePath = path.normalize(filePath);
      const dest = normalizedFilePath.replace(SRC_DIRECTORY, DIST_DIRECTORY);
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.copyFile(normalizedFilePath, dest);
    })
  );
}
