import {
  CreateServerDockerComposeParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { promises as fs } from "fs";
import path from "path";
import YAML from "yaml";
import { prepareYamlFile } from "../util/prepare-yaml-file";

import pluginWrapper from "../plugin-wrapper";
import { BASE_DIRECTORY, DOCKER_COMPOSE_FILE_NAME } from "./constants";

export async function createDockerComposeFile(): Promise<Module[]> {
  const filePath = path.resolve(
    __dirname,
    "docker-compose",
    DOCKER_COMPOSE_FILE_NAME
  );

  const eventParams: CreateServerDockerComposeParams["before"] = {
    fileContent: await fs.readFile(filePath, "utf-8"),
    outputFileName: DOCKER_COMPOSE_FILE_NAME.replace(".template", ""),
    updateProperties: {},
  };

  return pluginWrapper(
    createDockerComposeFileInternal,
    EventNames.CreateServerDotEnv,
    eventParams
  );
}

export async function createDockerComposeFileInternal(
  eventParams: CreateServerDockerComposeParams["before"]
): Promise<Module[]> {
  const baseDirectory = BASE_DIRECTORY;
  const preparedFile = prepareYamlFile(
    eventParams.fileContent,
    eventParams.updateProperties
  );

  return [
    {
      path: path.join(baseDirectory, eventParams.outputFileName),
      code: YAML.stringify(preparedFile, { nullStr: "~" }),
    },
  ];
}
