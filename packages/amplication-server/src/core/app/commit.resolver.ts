import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User, Commit } from 'src/models';
import { UserService } from '../';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';

@Resolver(() => Commit)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class CommitResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField(() => User)
  async user(@Parent() commit: Commit) {
    return this.userService.findUser({
      where: {
        id: commit.userId
      }
    });
  }
}
