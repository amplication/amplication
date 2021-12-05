import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
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
