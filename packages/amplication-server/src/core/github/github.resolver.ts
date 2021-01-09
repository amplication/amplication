import { Query, Resolver, Mutation } from '@nestjs/graphql';

import { User } from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseFilters, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { GithubService } from './github.service';
import { GithubRepo } from './dto/githubRepo';

@Resolver(() => GithubRepo)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GithubResolver {
  constructor(private readonly githubService: GithubService) {}

  @Query(() => [GithubRepo])
  async githubRepos(@UserEntity() currentUser: User): Promise<GithubRepo[]> {
    return this.githubService.getRepos(
      'yuval-hazaz'
    ); /**@todo: get settings from app settings */
  }
}
