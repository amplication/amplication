import { UseGuards, UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Build } from './dto/Build';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { BuildService } from './build.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { Commit, User } from 'src/models';
import { UserService } from '../user/user.service';
import { Action } from '../action/dto';
import { ActionService } from '../action/action.service';
import { CommitService } from '../commit/commit.service';
import { BuildStatus } from './dto/BuildStatus';

@Resolver(() => Build)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BuildResolver {
  constructor(
    private readonly service: BuildService,
    private readonly userService: UserService,
    private readonly actionService: ActionService,
    private readonly commitService: CommitService
  ) {}

  @Query(() => [Build])
  @AuthorizeContext(
    AuthorizableResourceParameter.ResourceId,
    'where.resource.id'
  )
  async builds(@Args() args: FindManyBuildArgs): Promise<Build[]> {
    return this.service.findMany(args);
  }

  @Query(() => Build)
  @AuthorizeContext(AuthorizableResourceParameter.BuildId, 'where.id')
  async build(@Args() args: FindOneBuildArgs): Promise<Build> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async createdBy(@Parent() build: Build): Promise<User> {
    return this.userService.findUser({ where: { id: build.userId } });
  }

  @ResolveField()
  async action(@Parent() build: Build): Promise<Action> {
    return this.actionService.findOne({ where: { id: build.actionId } });
  }

  @ResolveField()
  async commit(@Parent() build: Build): Promise<Commit> {
    return this.commitService.findOne({ where: { id: build.commitId } });
  }

  @ResolveField()
  archiveURI(@Parent() build: Build): string {
    return `/generated-apps/${build.id}.zip`;
  }
  
  @ResolveField()
  status(@Parent() build: Build): Promise<BuildStatus> {
    return this.service.calcBuildStatus(build.id);
  }

  @Mutation(() => Build)
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.createdBy.connect.id'
  )
  @AuthorizeContext(
    AuthorizableResourceParameter.ResourceId,
    'data.resource.connect.id'
  )
  async createBuild(@Args() args: CreateBuildArgs): Promise<Build> {
    return this.service.create(args);
  }
}
