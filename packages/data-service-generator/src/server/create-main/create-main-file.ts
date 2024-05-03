import path from "path";
import {
  CreateMainFileParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { MAIN_TS_FILE_NAME, MAIN_TS_WITH_BIGINT_FILE_NAME } from "../constants";
import DsgContext from "../../dsg-context";
import {
  formatCode,
  parse,
  print,
  readFile,
} from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";
import fs from "fs";
import { namedTypes } from "ast-types";

export async function createMainFile(): Promise<ModuleMap> {
  const mainFilePath = path.resolve(__dirname, MAIN_TS_FILE_NAME);
  const template = await readFile(mainFilePath);

  return pluginWrapper(createMainFileInternal, EventNames.CreateMainFile, {
    template,
  });
}

export async function createMainFileInternal({
  template,
}: CreateMainFileParams): Promise<ModuleMap> {
  const { logger, serverDirectories, hasBigIntFields } = DsgContext.getInstance;
  const moduleMap = new ModuleMap(logger);

  if (hasBigIntFields) {
    const bigIntMainFilePath = path.resolve(
      __dirname,
      MAIN_TS_WITH_BIGINT_FILE_NAME
    );

    const bigIntMainFileExpression = parse(
      fs.readFileSync(bigIntMainFilePath, "utf-8")
    );

    const mainFunction = template.program.body.find(
      (node) => node.type === "FunctionDeclaration" && node.id.name == "main"
    ) as namedTypes.FunctionDeclaration;

    const [nestFactoryCreateCallExpression, ...rest] = mainFunction.body.body;

    mainFunction.body.body = [
      nestFactoryCreateCallExpression,
      bigIntMainFileExpression.program.body[0],
      ...rest,
    ];
  }

  await logger.info("Creating main.ts file...");

  const mainModule: Module = {
    path: path.join(serverDirectories.srcDirectory, MAIN_TS_FILE_NAME),
    code: print(template).code,
  };

  await moduleMap.set(mainModule);

  await logger.info("Formatting main.ts file...");
  await moduleMap.replaceModulesPath((path) => path.replace(".template", ""));
  await moduleMap.replaceModulesCode((path, code) => formatCode(path, code));

  return moduleMap;
}
