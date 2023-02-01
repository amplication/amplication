import { join } from "path";
import { AMPLICATION_IGNORED_FOLDER } from "../git/git.constants";
import { File } from "../types";

export async function prepareFilesForPullRequest(
  gitResourceMeta,
  pullRequestModule,
  amplicationIgnoreManger
): Promise<File[]> {
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

  const files: File[] = pullRequestModule.map((module) => {
    // ignored file
    if (amplicationIgnoreManger.isIgnored(module.path)) {
      return [
        {
          file: join(AMPLICATION_IGNORED_FOLDER, module.path),
          content: module.code,
        },
      ];
    }
    // Deleted file
    if (module.code === null) {
      return [{ path: module.path, code: module.code }];
    }
    // Regex ignored file
    if (
      !module.path.startsWith(authFolder) &&
      doNotOverride.some((rx) => rx.test(module.path))
    ) {
      const path = module.path;
      const content = ({ exists }) => {
        // do not create the file if it already exist
        if (exists) return null;

        return module.code;
      };
      return [{ path, content }];
    }
    // Regular file
    return [{ path: module.path, code: module.code }];
  });
  return files;
}
