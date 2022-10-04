import * as path from "path";
import * as fs from "fs";
import fg from "fast-glob";
import entities from "../src/tests/entities";
import roles from "../src/tests/roles";
import { appInfo } from "../src/tests/appInfo";
import { AppInfo, Module } from "@amplication/code-gen-types";
import { createDataService } from "../src/create-data-service";
import { EnumResourceType } from "../src/models";
import { installedPlugins } from "../src/tests/pluginInstallation";
import { normalize } from "path";
/** The directory of the source code public assests */
const SRC_DIRECTORY = path.join(__dirname, "..", "src");
/*** The directory of the admin source code public assests */
const ADMIN_STATIC_ASSETS_DIRECTORY = path.join(
  SRC_DIRECTORY,
  "admin/static/public"
);
const ADMIN_STATIC_ASSETS_DIRECTORY_GLOB = normalize(
  ADMIN_STATIC_ASSETS_DIRECTORY
);
/** The globs to copy to generated application */
const ADMIN_GLOB_SOURCES: string[] = [
  `${ADMIN_STATIC_ASSETS_DIRECTORY_GLOB}/**/*.(png|svg)`,
];

if (require.main === module) {
  const [, , output] = process.argv;
  if (!output) {
    throw new Error("OUTPUT is not defined");
  }
  generateTestDataService(output, appInfo).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default async function generateTestDataService(
  destination: string,
  appInfo: AppInfo
): Promise<void> {
  const modules = await createDataService({
    entities,
    roles,
    resourceInfo: appInfo,
    resourceType: EnumResourceType.Service,
    pluginInstallations: installedPlugins,
  });
  await writeModules(modules, destination);
  await copyFiles(
    ADMIN_GLOB_SOURCES,
    path.join(__dirname, "..", `${destination}/admin-ui/public/`)
  );
}

async function writeModules(
  modules: Module[],
  destination: string
): Promise<void> {
  console.info(`Writing modules to ${destination}${path.sep} ...`);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = path.join(destination, module.path);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, module.code);
    })
  );
  console.info(`Successfully wrote modules to ${destination}${path.sep}`);
}

async function copyFiles(
  globSources: string[],
  destination: string
): Promise<void> {
  // Get a full list of files to copy
  const filePathsList = await Promise.all(
    globSources.map(async (source) => {
      const paths = await fg([source], {
        dot: true,
        ignore: ["**/node_modules/**"],
      });
      return paths;
    })
  );
  const filePaths = filePathsList.flat();
  // Copy all matching files to respective generated app directory
  await Promise.all(
    filePaths.map(async (filePath: string) => {
      const normalizedFilePath = path.normalize(filePath);
      var fileNameIndex = filePath.lastIndexOf("/");
      var fileName = filePath.substring(fileNameIndex + 1);
      const dest = `${destination}${fileName}`;
      await fs.promises.copyFile(normalizedFilePath, dest);
    })
  );
}
