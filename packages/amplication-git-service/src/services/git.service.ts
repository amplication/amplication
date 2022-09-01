import { Injectable } from '@nestjs/common';
import { PrModule } from '../types';
import { GitResourceMeta } from '../contracts/GitResourceMeta';
import { GithubFile } from '../Dto/entities/GithubFile';
import { RemoteGitOrganization } from '../Dto/entities/RemoteGitOrganization';
import { RemoteGitRepository } from '../Dto/entities/RemoteGitRepository';
import { EnumGitOrganizationType } from '../Dto/enums/EnumGitOrganizationType';
import { EnumGitProvider } from '../Dto/enums/EnumGitProvider';
import { GitServiceFactory } from '../utils/GitServiceFactory';

@Injectable()
export class GitService {
  constructor(private readonly gitServiceFactory: GitServiceFactory) {}

  async getReposOfOrganization(
    gitProvider: EnumGitProvider,
    installationId: string
  ): Promise<RemoteGitRepository[]> {
    const gitService = this.gitServiceFactory.getService(gitProvider);
    return await gitService.getOrganizationRepos(installationId);
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
}
