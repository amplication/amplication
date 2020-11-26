import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FindManyCommitArgs } from './dto/FindManyCommitArgs';
import { FindOneCommitArgs } from './dto/FindOneCommitArgs';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Commit, User } from 'src/models';
import { UserService } from '../user/user.service';
import { CommitService } from './commit.service';
import { Build } from '../build/dto/Build';
import { BuildService } from '../build/build.service';
import { FindManyBuildArgs } from '../build/dto/FindManyBuildArgs';
import { PendingChange } from '../app/dto/PendingChange';

@Resolver(() => Commit)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class CommitResolver {
  constructor(
    private readonly commitService: CommitService,
    private readonly userService: UserService,
    private readonly buildService: BuildService
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
  async commit(@Args() args: FindOneCommitArgs): Promise<Commit> {
    return this.commitService.findOne(args);
  }

  @Query(() => [Commit], {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async commits(@Args() args: FindManyCommitArgs): Promise<Commit[]> {
    return this.commitService.findMany(args);
  }

  @ResolveField(() => [Build])
  builds(
    @Parent() commit: Commit,
    @Args() args: FindManyBuildArgs
  ): Promise<Build[]> {
    return this.buildService.findMany({
      ...args,
      where: {
        ...args.where,
        commit: {
          id: commit.id
        }
      }
    });
  }

  @ResolveField(() => [PendingChange])
  changes(@Parent() commit: Commit): Promise<PendingChange[]> {
    return this.commitService.getChanges(commit.id);
  }
}
