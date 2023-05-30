import {
  CreateServerGitIgnoreParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { formatGitignorePaths } from "../../utils/format-gitignore-paths";

const IGNORED_PATHS = [
  "# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.",
  " ",
  "/node_modules",
  "/dist",
  ".DS_Store",
];

export function createGitIgnore(): ModuleMap {
  return pluginWrapper(
    createGitIgnoreInternal,
    EventNames.CreateServerGitIgnore,
    { gitignorePaths: IGNORED_PATHS }
  );
}

export async function createGitIgnoreInternal({
  gitignorePaths,
}: CreateServerGitIgnoreParams): Promise<ModuleMap> {
  const formattedGitignore = formatGitignorePaths(gitignorePaths);
  const context = DsgContext.getInstance;
  const { serverDirectories } = context;

  const module: Module = {
    path: `${serverDirectories.baseDirectory}/.gitignore`,
    code: formattedGitignore,
  };

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}
