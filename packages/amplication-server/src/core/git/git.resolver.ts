import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitService } from './git.service';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitService) {}
  //   @Mutation(() => GitRepo)
  //   async createRepoInOrg() {
  //     // return;
  //   }

  @Query(() => [GitRepo])
  //   @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id') //TODO what is that?
  async getReposOfUser(@Args() args: GetReposListArgs): Promise<GitRepo[]> {
    return this.gitService.getReposOfUser(args);
  }
}
