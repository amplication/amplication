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
    gitProvider: EnumGitProvider,
    userName: string,
    repoName: string,
    modules: PrModule[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    installationId: string,
    gitResourceMeta: GitResourceMeta,
    baseBranchName?: string
  ): Promise<string> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return await service.createPullRequest(
      userName,
      repoName,
      modules,
      commitName,
      commitMessage,
      commitDescription,
      baseBranchName,
      installationId,
      gitResourceMeta
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
}
