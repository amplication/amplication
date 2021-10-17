import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
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
  async createRepoInOrg(@Args() args: CreateRepoArgs): Promise<GitRepo> {
    return this.gitService.createRepoInOrg(args);
  }
  //#endregion
  //#region Query
  @Query(() => [GitRepo])
  //   @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id') //TODO what is that?
  async getReposOfUser(@Args() args: GetReposListArgs): Promise<GitRepo[]> {
    return this.gitService.getReposOfUser(args);
  }
  //#endregion
}
