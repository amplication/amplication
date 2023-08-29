import { join } from "path";
import fs from "fs";
import { version } from "../../../package.json";
import * as prettier from "prettier";

if (require.main === module) {
  void updateVersion().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function updateVersion(): Promise<void> {
  const versionFilePath = join(__dirname + "/../src/util/version.ts");

  const src = prettier.format(`export const version = '${version}';`, {
    parser: "typescript",
  });

  fs.writeFile(versionFilePath, src, { flag: "w" }, function (error) {
    if (!error) return;
    console.error(error);
  });
}
