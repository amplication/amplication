import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { prepareYamlFile } from "../../utils/prepare-yaml-file";
import { DOCKER_COMPOSE_DEV_FILE_NAME } from "../constants";
import {
  CreateServerDockerComposeDBParams,
  CreateServerDockerComposeDevParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { promises as fs } from "fs";
import path from "path";

export async function createDockerComposeDevFile(): Promise<ModuleMap> {
  const filePath = path.resolve(__dirname, DOCKER_COMPOSE_DEV_FILE_NAME);

  const eventParams: CreateServerDockerComposeDBParams = {
    fileContent: await fs.readFile(filePath, "utf-8"),
    outputFileName: DOCKER_COMPOSE_DEV_FILE_NAME.replace(".template", ""),
    updateProperties: [],
  };

  return pluginWrapper(
    createDockerComposeDBFileInternal,
    EventNames.CreateServerDockerComposeDB,
    eventParams
  );
}

async function createDockerComposeDBFileInternal(
  eventParams: CreateServerDockerComposeDBParams
): Promise<ModuleMap> {
  return pluginWrapper(
    createDockerComposeDevFileInternal,
    EventNames.CreateServerDockerComposeDev,
    eventParams
  );
}

async function createDockerComposeDevFileInternal(
  eventParams: CreateServerDockerComposeDevParams
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
