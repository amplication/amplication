import {
  CreateAdminGitIgnoreParams,
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
  "# dependencies",
  "/node_modules",
  "/.pnp",
  ".pnp.js",
  " ",
  "# testing",
  "/coverage",
  " ",
  "# production",
  "/build",
  " ",
  "# misc",
  ".DS_Store",
  ".env.local",
  ".env.development.local",
  ".env.test.local",
  ".env.production.local",
  " ",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
];

export function createGitIgnore(): ModuleMap {
  return pluginWrapper(
    createGitIgnoreInternal,
    EventNames.CreateAdminGitIgnore,
    { gitignorePaths: IGNORED_PATHS }
  );
}

export async function createGitIgnoreInternal({
  gitignorePaths,
}: CreateAdminGitIgnoreParams): Promise<ModuleMap> {
  const formattedGitignore = formatGitignorePaths(gitignorePaths);
  const context = DsgContext.getInstance;
  const { clientDirectories } = context;
  const module: Module = {
    path: `${clientDirectories.baseDirectory}/.gitignore`,
    code: formattedGitignore,
  };

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}
