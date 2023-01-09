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
    gitResourceMeta: GitResourceMeta,
    baseBranchName?: string | undefined
  ): Promise<string> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return await service.createPullRequest(
      mode,
      userName,
      repoName,
      modules,
      commitName,
      commitMessage,
      commitDescription,
      installationId,
      head,
      gitResourceMeta,
      baseBranchName
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
    baseBranchName?: string
  ): Promise<Branch> {
    const service = this.gitServiceFactory.getService(gitProvider);
    return service.createBranch(
      installationId,
      owner,
      repo,
      newBranchName,
      baseBranchName
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
}
