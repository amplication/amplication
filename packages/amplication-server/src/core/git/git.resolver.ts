import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { url } from 'inspector';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GitOrganization } from 'src/models/GitOrganization';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthorizeAppWithGithubResult } from '../app/dto/AuthorizeAppWithGithubResult';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GetGitOrganizationsArgs } from './dto/args/GetGitOrganizationsArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitService } from './git.service';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitService) {}
  //#region Mutation
  @Mutation(() => GitRepo)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async createRepoInOrg(@Args() args: CreateRepoArgs): Promise<GitRepo> {
    return this.gitService.createRepo(args);
  }

  @Mutation(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async getOrganization(@Args() args: BaseGitArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }

  @Mutation(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.WorkspaceId, 'workspaceId') 
  async createOrganization(@Args() args: CreateGitOrganizationArgs): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async deleteOrganization(@Args() args: BaseGitArgs): Promise<boolean> {
    return this.gitService.deleteGitOrganization(args);
  }

  @Mutation(() => AuthorizeAppWithGithubResult)
  @AuthorizeContext(AuthorizableResourceParameter.WorkspaceId, 'workspaceId')
  async getGithubAppInstallationUrl(@Args() args: GetGitInstallationUrlArgs): Promise<AuthorizeAppWithGithubResult> {
    return {
      url: await this.gitService.getGithubAppInstallationUrl(args)
    };
      
  }

  //#endregion
  //#region Query
  @Query(() => [GitRepo])
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async getReposOfUser(@Args() args: GetReposListArgs): Promise<GitRepo[]> {
    return this.gitService.getReposOfUser(args);
  }

  @Query(() => [GitOrganization])
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async getGitOrganizations(@Args() args: GetGitOrganizationsArgs): Promise<GitOrganization[]> {
    return this.gitService.getGitOrganizations(args.workspaceId);
  }

  @Query(() => String)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId')
  async getUsername(@Args() args: BaseGitArgs): Promise<string> {
    return this.gitService.getUsername(args);
  }

  @Query(() => String)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'gitOrganizationId')
  async getGitOrganizationName(@Args() args: BaseGitArgs): Promise<string> {
    return this.gitService.getGitOrganizationName(args);
  }
  //#endregion
  
}
