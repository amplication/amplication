/* eslint-disable no-console */
import { join } from "path";
import fs from "fs";
import * as prettier from "prettier";

if (require.main === module) {
  const version = process.argv[2];
  if (!version || !version.match(/^\d+\.\d+\.\d+$/)) {
    console.error(
      "Version argument is invalid. Please provide a version like 1.0.0, 1.0.1, etc."
    );
    process.exit(1);
  }

  void updateVersion(process.argv[2]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function updateVersion(version: string): Promise<void> {
  const versionFilePath = join(__dirname + "/../src/util/version.ts");

  const code = `export const version = '${version}';`;
  const src = prettier.format(code, {
    parser: "typescript",
  });

  fs.writeFile(versionFilePath, src, { flag: "w" }, function (error) {
    if (!error) return;
    console.error(error);
  });
}
