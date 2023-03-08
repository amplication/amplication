import { join } from "path";
import { AMPLICATION_IGNORED_FOLDER } from "../providers/git.constants";
import { File, GitResourceMeta, UpdateFile } from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";

export async function prepareFilesForPullRequest(
  gitResourceMeta: GitResourceMeta,
  pullRequestModule: File[],
  amplicationIgnoreManger: AmplicationIgnoreManger
): Promise<UpdateFile[]> {
  //do not override files in 'server/src/[entity]/[entity].[controller/resolver/service/module].ts'
  //do not override server/scripts/customSeed.ts
  const doNotOverride = [
    new RegExp(
      `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.controller.ts$`
    ),
    new RegExp(
      `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.resolver.ts$`
    ),
    new RegExp(
      `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.service.ts$`
    ),
    new RegExp(
      `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.module.ts$`
    ),
    new RegExp(
      `^${gitResourceMeta.serverPath || "server"}/scripts/customSeed.ts$`
    ),
  ];

  const authFolder = "server/src/auth/";

  const files: UpdateFile[] = pullRequestModule.map((module) => {
    // ignored file
    if (amplicationIgnoreManger.isIgnored(module.path)) {
      return {
        path: join(AMPLICATION_IGNORED_FOLDER, module.path),
        content: module.content,
      };
    }
    // Deleted file
    if (module.content === null) {
      return { path: module.path, content: module.content };
    }
    // Regex ignored file
    if (
      !module.path.startsWith(authFolder) &&
      doNotOverride.some((rx) => rx.test(module.path))
    ) {
      return {
        path: module.path,
        content: ({ exists }) => {
          // do not create the file if it already exist
          if (exists) return null;

          return module.content;
        },
      };
    }
    // Regular file
    return { path: module.path, content: module.content };
  });
  return files;
}
