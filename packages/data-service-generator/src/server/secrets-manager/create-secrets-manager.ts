import {
  CreateServerSecretsManagerParams,
  EventNames,
  ModuleMap,
  SecretsNameKey,
} from "@amplication/code-gen-types";
import { print } from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { builders, namedTypes } from "ast-types";
import { createDTOFile } from "../resource/dto/create-dto-module";
import { pascalCase } from "pascal-case";
import path from "path";
import fg from "fast-glob";
import { promises as fsPromises } from "fs";
import { getFileEncoding } from "@amplication/dsg-utils";

export function createSecretsManager(
  eventParams: CreateServerSecretsManagerParams
): ModuleMap {
  return pluginWrapper(
    createSecretsManagerInternal,
    EventNames.CreateServerSecretsManager,
    eventParams
  );
}

export async function createSecretsManagerInternal({
  secretsNameKey,
}: CreateServerSecretsManagerParams): Promise<ModuleMap> {
  const { logger, serverDirectories } = DsgContext.getInstance;

  const basePath = `${serverDirectories.srcDirectory}/providers/secrets`;
  const secretManagerStaticFilesDirectory = path.resolve(__dirname, "static");
  const staticFilesPath = await fg(
    `${secretManagerStaticFilesDirectory}/**/*`,
    {
      absolute: false,
      dot: true,
      ignore: ["**.js", "**.js.map", "**.d.ts"],
    }
  );

  const ENUM_MODULE_PATH = `${basePath}/secretsNameKey.enum.ts`;
  const enumDeclaration = createTSEnumSecretsNameKey(secretsNameKey);
  const enumFile = createDTOFile(enumDeclaration, ENUM_MODULE_PATH, {});

  const moduleMap = new ModuleMap(logger);
  await moduleMap.set({
    path: ENUM_MODULE_PATH,
    code: print(enumFile).code,
  });

  for (const modulePath of staticFilesPath) {
    const encoding = getFileEncoding(modulePath);
    const path = modulePath
      .replace(".template", "")
      .replace(secretManagerStaticFilesDirectory, basePath);
    const module = {
      path,
      code: await fsPromises.readFile(modulePath, encoding),
    };

    await moduleMap.set(module);
  }

  return moduleMap;
}

function createTSEnumSecretsNameKey(
  secretsNameKey: SecretsNameKey[]
): namedTypes.TSEnumDeclaration {
  const ENUM_SECRETS_NAME_KEY = builders.identifier("EnumSecretsNameKey");
  return builders.tsEnumDeclaration(
    ENUM_SECRETS_NAME_KEY,
    secretsNameKey.map(({ name, key }) =>
      builders.tsEnumMember(
        builders.identifier(pascalCase(name)),
        builders.stringLiteral(key)
      )
    )
  );
}
