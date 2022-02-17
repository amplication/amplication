import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GitOrganization } from 'src/models/GitOrganization';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitService } from './git.service';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitService) {}
  //#region Mutation
  @Mutation(() => GitRepo)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId')
  async createRepoInOrg(@Args() args: CreateRepoArgs): Promise<GitRepo> {
    return this.gitService.createRepo(args);
  }

  @Mutation(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId') //todo: change to organizationId
  async getOrganization(@Args() args: BaseGitArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }

  @Mutation(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId') //todo: change to organizationId
  async createOrganization(@Args() args: CreateGitOrganizationArgs): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId') //todo: change to organizationId
  async deleteOrganization(@Args() args: BaseGitArgs): Promise<boolean> {
    return this.gitService.deleteGitOrganization(args);
  }

  @Mutation(() => String)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId') //todo: change to organizationId
  async getGithubAppInstallationUrl(@Args() args: BaseGitArgs): Promise<string> {
    return this.gitService.getGithubAppInstallationUrl(args);
  }

  //#endregion
  //#region Query
  @Query(() => [GitRepo])
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId')
  async getReposOfUser(@Args() args: GetReposListArgs): Promise<GitRepo[]> {
    return this.gitService.getReposOfUser(args);
  }
  @Query(() => String)
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'appId')
  async getUsername(@Args() args: BaseGitArgs): Promise<string> {
    return this.gitService.getUsername(args);
  }
  //#endregion
  
}
