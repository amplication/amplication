import { join } from "lodash";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { AMPLICATION_IGNORED_FOLDER } from "../git/git.constants";
import { AmplicationIgnoreManger } from "./amplication-ignore-manger";

export async function prepareFilesForPullRequest(
  owner,
  repositoryName,
  gitResourceMeta,
  pullRequestModule
): Promise<Required<Changes["files"]>> {
  const amplicationIgnoreManger = new AmplicationIgnoreManger();
  await amplicationIgnoreManger.init(async (fileName) => {
    try {
      const file = await this.getFile({
        owner,
        repositoryUrl: repositoryName,
        path: fileName,
        baseBranch: undefined, // take the default branch
      });
      const { content, htmlUrl, name } = file;
      console.log(`Got ${name} file ${htmlUrl}`);
      return content;
    } catch (error) {
      console.log("Repository does not have a .amplicationignore file");
      return "";
    }
  });

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

  const files: Required<Changes["files"]> = Object.fromEntries(
    pullRequestModule.map((module) => {
      // ignored file
      if (amplicationIgnoreManger.isIgnored(module.path)) {
        return [join(AMPLICATION_IGNORED_FOLDER, module.path), module.code];
      }
      // Deleted file
      if (module.code === null) {
        return [module.path, module.code];
      }
      // Regex ignored file
      if (
        !module.path.startsWith(authFolder) &&
        doNotOverride.some((rx) => rx.test(module.path))
      ) {
        return [
          module.path,
          ({ exists }) => {
            // do not create the file if it already exist
            if (exists) return null;

            return module.code;
          },
        ];
      }
      // Regular file
      return [module.path, module.code];
    })
  );
  return files;
}
