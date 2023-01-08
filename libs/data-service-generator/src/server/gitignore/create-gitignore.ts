import {
  CreateServerGitIgnoreParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { readCode } from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";

const templatePath = require.resolve("./template.gitignore");

export function createGitIgnore(
  eventParams: CreateServerGitIgnoreParams = {}
): Module[] {
  return pluginWrapper(
    createGitIgnoreModuleInternal,
    EventNames.CreateServerGitIgnore,
    eventParams
  );
}

export async function createGitIgnoreModuleInternal(): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { serverDirectories } = context;
  return [
    {
      path: `${serverDirectories.baseDirectory}/.gitignore`,
      code: await readCode(templatePath),
    },
  ];
}
