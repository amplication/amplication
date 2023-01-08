import {
  CreateAdminGitIgnoreParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { readCode } from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";

const templatePath = require.resolve("./template.gitignore");

export function createGitIgnore(
  eventParams: CreateAdminGitIgnoreParams = {}
): Module[] {
  return pluginWrapper(
    createGitIgnoreInternal,
    EventNames.CreateAdminGitIgnore,
    eventParams
  );
}

export async function createGitIgnoreInternal(): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { clientDirectories } = context;
  return [
    {
      path: `${clientDirectories.baseDirectory}/.gitignore`,
      code: await readCode(templatePath),
    },
  ];
}
