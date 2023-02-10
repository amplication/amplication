import {
  CreateServerGitIgnoreParams,
  EventNames,
  Module,
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

export function createGitIgnore(): Module[] {
  return pluginWrapper(
    createGitIgnoreModuleInternal,
    EventNames.CreateServerGitIgnore,
    { gitignorePaths: IGNORED_PATHS }
  );
}

export async function createGitIgnoreModuleInternal({
  gitignorePaths,
}: CreateServerGitIgnoreParams): Promise<Module[]> {
  const formattedGitignore = formatGitignorePaths(gitignorePaths);
  const context = DsgContext.getInstance;
  const { serverDirectories } = context;
  return [
    {
      path: `${serverDirectories.baseDirectory}/.gitignore`,
      code: formattedGitignore,
    },
  ];
}
