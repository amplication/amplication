import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FindManyCommitArgs, FindOneCommitArgs } from 'prisma/dal';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Commit, User } from 'src/models';
import { UserService } from '../user/user.service';
import { CommitService } from './commit.service';

@Resolver(() => Commit)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class CommitResolver {
  constructor(
    private readonly commitService: CommitService,
    private readonly userService: UserService
  ) {}

  @ResolveField(() => User)
  async user(@Parent() commit: Commit) {
    return this.userService.findUser({
      where: {
        id: commit.userId
      }
    });
  }

  @Query(() => Commit, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.CommitId, 'where.id')
  async findOne(@Args() args: FindOneCommitArgs): Promise<Commit> {
    return this.commitService.findOne(args);
  }

  @Query(() => [Commit], {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.CommitId, 'where.id')
  async findMany(@Args() args: FindManyCommitArgs): Promise<Commit[]> {
    return this.commitService.findMany(args);
  }
}
