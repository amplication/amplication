import path from "path";
import colors from "colors/safe";
import fs from "fs";
import { version } from "../package.json";
import * as prettier from "prettier";

if (require.main === module) {
  void updateVersion().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function updateVersion(): Promise<void> {
  console.log(colors.green("\nUpdate package version data"));

  const versionFilePath = path.join(__dirname + "/../src/version.ts");

  const src = prettier.format(`export const version = '${version}';`, {
    parser: "typescript",
  });

  fs.writeFile(versionFilePath, src, { flag: "w" }, function (error) {
    console.error(error);
  });

  console.log(
    colors.green(`Updating application version ${colors.yellow(version)}`)
  );
  console.log(
    `${colors.green("Writing version module to ")}${colors.yellow(
      versionFilePath
    )}\n`
  );
}
