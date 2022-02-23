import { Injectable } from '@nestjs/common';
import { GitOrganization } from 'src/models/GitOrganization';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GetGitOrganizationsArgs } from './dto/args/GetGitOrganizationsArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitUser } from './dto/objects/GitUser';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';

@Injectable()
export class GitService {
  constructor(private readonly gitServiceFactory: GitServiceFactory) {}

  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const { sourceControlService, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getUserRepos(gitOrganizationId);
  }
  async createRepo(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, gitOrganizationId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.createRepo({
      gitOrganizationId,
      input: input
    });
  }

  async getUsername(args: BaseGitArgs): Promise<string> {
    return (await this.getUser(args)).username;
  }
  async getUser(args: BaseGitArgs): Promise<GitUser> {
    const { gitOrganizationId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const token = await service.tokenExtractor.getTokenFromDb(
      gitOrganizationId
    );
    return await service.getUser(token);
  }

  async getGitOrganizationName(args: BaseGitArgs): Promise<string> {
    const { gitOrganizationId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await (await service.getGitOrganization(gitOrganizationId)).name;
  }

  async createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    const { provider } = args.data;
    const service = this.gitServiceFactory.getService(provider);
    return await service.createGitOrganization(args);
  }

  async getGitOrganizations(
    args: GetGitOrganizationsArgs
  ): Promise<GitOrganization[]> {
    const { sourceControlService, workspaceId } = args.data;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGitOrganizations(workspaceId);
  }

  async getGitOrganization(args: BaseGitArgs): Promise<GitOrganization> {
    const { gitOrganizationId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGitOrganization(gitOrganizationId);
  }

  async getGithubAppInstallationUrl(
    args: GetGitInstallationUrlArgs
  ): Promise<string> {
    const { sourceControlService, workspaceId } = args.data;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGithubAppInstallationUrl(workspaceId);
  }

  async deleteGitOrganization(args: BaseGitArgs): Promise<boolean> {
    const { sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.deleteGitOrganization(args.gitOrganizationId);
  }
}
