import { Injectable } from "@nestjs/common";
import {
  EnumGitOrganizationType,
  EnumGitProvider,
  GitResourceMeta,
  PrModule,
} from "./git.types";
import { GithubFile } from "./dto/github-file.dto";
import { GitServiceFactory } from "./git-service-factory";
import {
  RemoteGitRepos,
  RemoteGitRepository,
} from "./dto/remote-git-repository";
import { RemoteGitOrganization } from "./dto/remote-git-organization.dto";
import { Branch } from "./dto/branch";
import { EnumPullRequestMode } from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { join } from "path";
import { AMPLICATION_IGNORED_FOLDER } from "./git.constants";

@Injectable()
export class GitService {
  constructor(private readonly gitServiceFactory: GitServiceFactory) {}

  async getReposOfOrganization(
    gitProvider: EnumGitProvider,
    installationId: string,
    limit: number,
    page: number
  ): Promise<RemoteGitRepos> {
    const gitService = this.gitServiceFactory.getService(gitProvider);
    return await gitService.getOrganizationRepos(installationId, limit, page);
  }

  async createGitRepository(
    repoName: string,
    gitProvider: EnumGitProvider,
    gitOrganizationType: EnumGitOrganizationType,
    gitOrganizationName: string,
    installationId: string,
    isPublic: boolean
  ): Promise<RemoteGitRepository> {
    const provider = this.gitServiceFactory.getService(gitProvider);
    return await (gitOrganizationType === EnumGitOrganizationType.Organization
      ? provider.createOrganizationRepository(
          installationId,
          gitOrganizationName,
          repoName,
          isPublic
        )
      : provider.createUserRepository(
          installationId,
          gitOrganizationName,
          repoName,
          isPublic
        ));
  }
  async getGitRemoteOrganization(
    installationId: string,
    gitProvider: EnumGitProvider
  ): Promise<RemoteGitOrganization> {
    const provider = this.gitServiceFactory.getService(gitProvider);
    return await provider.getGitRemoteOrganization(installationId);
  }

  async deleteGitOrganization(
    gitProvider: EnumGitProvider,
    installationId: string
  ): Promise<boolean> {
    const provider = this.gitServiceFactory.getService(gitProvider);
    return await provider.deleteGitOrganization(installationId);
  }

  async getGitInstallationUrl(
    gitProvider: EnumGitProvider,
    workspaceId: string
  ): Promise<string> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return await service.getGitInstallationUrl(workspaceId);
  }

  async getFile(
    gitProvider: EnumGitProvider,
    userName: string,
    repoName: string,
    path: string,
    baseBranchName: string,
    installationId: string
  ): Promise<GithubFile> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return await service.getFile(
      userName,
      repoName,
      path,
      baseBranchName,
      installationId
    );
  }

  async createPullRequest(
    mode: EnumPullRequestMode,
    gitProvider: EnumGitProvider,
    userName: string,
    repoName: string,
    modules: PrModule[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    installationId: string,
    head: string,
    gitResourceMeta: GitResourceMeta
  ): Promise<string> {
    const service = this.gitServiceFactory.getService(gitProvider);

    const amplicationIgnoreManger = new AmplicationIgnoreManger();
    await amplicationIgnoreManger.init(async (fileName) => {
      try {
        const file = await service.getFile(
          userName,
          repoName,
          fileName,
          undefined, // take the default branch
          installationId
        );
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
      modules.map((module) => {
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

    return await service.createPullRequest(
      mode,
      userName,
      repoName,
      files,
      commitName,
      commitMessage,
      commitDescription,
      installationId,
      head
    );
  }

  getRepository(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string
  ) {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.getRepository(installationId, owner, repo);
  }

  createBranch(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string,
    newBranchName: string,
    sha?: string
  ): Promise<Branch> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.createBranch(
      installationId,
      owner,
      repo,
      newBranchName,
      sha
    );
  }

  isBranchExist(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string,
    branch: string
  ) {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.isBranchExist(installationId, owner, repo, branch);
  }

  getBranch(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string,
    branch: string
  ): Promise<Branch> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.getBranch(installationId, owner, repo, branch);
  }

  getFirstDefaultBranchCommit(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string
  ) {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.getFirstDefaultBranchCommit(installationId, owner, repo);
  }
}
