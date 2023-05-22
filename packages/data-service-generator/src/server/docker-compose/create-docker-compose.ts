import {
  CreateServerDockerComposeParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { promises as fs } from "fs";
import path from "path";
import { prepareYamlFile } from "../../utils/prepare-yaml-file";

import pluginWrapper from "../../plugin-wrapper";
import { DOCKER_COMPOSE_FILE_NAME } from "../constants";
import DsgContext from "../../dsg-context";

export async function createDockerComposeFile(): Promise<ModuleMap> {
  const filePath = path.resolve(__dirname, DOCKER_COMPOSE_FILE_NAME);

  const eventParams: CreateServerDockerComposeParams = {
    fileContent: await fs.readFile(filePath, "utf-8"),
    outputFileName: DOCKER_COMPOSE_FILE_NAME.replace(".template", ""),
    updateProperties: [],
  };

  return pluginWrapper(
    createDockerComposeFileInternal,
    EventNames.CreateServerDockerCompose,
    eventParams
  );
}

async function createDockerComposeFileInternal(
  eventParams: CreateServerDockerComposeParams
): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const preparedFile = prepareYamlFile(
    eventParams.fileContent,
    eventParams.updateProperties
  );

  const module: Module = {
    path: path.join(
      serverDirectories.baseDirectory,
      eventParams.outputFileName
    ),
    code: preparedFile,
  };
  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}
