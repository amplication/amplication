import path from "path";
import {
  CreateMainFileParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { MAIN_TS_FILE_NAME, MAIN_TS_WITH_BIGINT_FILE_NAME } from "../constants";
import DsgContext from "../../dsg-context";
import { formatCode, print, readFile } from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";

export async function createMainFile(): Promise<ModuleMap> {
  const mainFilePath = path.resolve(__dirname, MAIN_TS_FILE_NAME);
  const mainWithBigintFilePath = path.resolve(
    __dirname,
    MAIN_TS_WITH_BIGINT_FILE_NAME
  );
  const template = await readFile(mainFilePath);
  const bigIntTemplate = await readFile(mainWithBigintFilePath);

  return pluginWrapper(createMainFileInternal, EventNames.CreateMainFile, {
    template,
    bigIntTemplate,
  });
}

export async function createMainFileInternal({
  template,
  bigIntTemplate,
}: CreateMainFileParams): Promise<ModuleMap> {
  const { logger, serverDirectories, hasBigIntFields } = DsgContext.getInstance;
  const moduleMap = new ModuleMap(logger);

  await logger.info("Creating main.ts file...");

  const mainModule: Module = {
    path: path.join(serverDirectories.srcDirectory, MAIN_TS_FILE_NAME),
    code: print(template).code,
  };

  const mainWithBigintModule: Module = {
    path: path.join(
      serverDirectories.srcDirectory,
      MAIN_TS_WITH_BIGINT_FILE_NAME.replace(".with-bigint", "")
    ),
    code: print(bigIntTemplate).code,
  };

  if (hasBigIntFields) {
    await moduleMap.set(mainWithBigintModule);
  } else {
    await moduleMap.set(mainModule);
  }

  await logger.info("Formatting main.ts file...");
  await moduleMap.replaceModulesPath((path) => path.replace(".template", ""));
  await moduleMap.replaceModulesCode((path, code) => formatCode(path, code));

  return moduleMap;
}
