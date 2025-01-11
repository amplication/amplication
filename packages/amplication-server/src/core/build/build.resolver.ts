import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Commit, Resource, User } from "../../models";
import { ActionService } from "../action/action.service";
import { Action } from "../action/dto";
import { CommitService } from "../commit/commit.service";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { BuildService } from "./build.service";
import { Build } from "./dto/Build";
import { FindManyBuildArgs } from "./dto/FindManyBuildArgs";
import { FindOneBuildArgs } from "./dto/FindOneBuildArgs";
import { EnumBuildStatus } from "./dto/EnumBuildStatus";
import { BuildPlugin } from "./dto/BuildPlugin";

@Resolver(() => Build)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BuildResolver {
  constructor(
    private readonly service: BuildService,
    private readonly userService: UserService,
    private readonly actionService: ActionService,
    private readonly commitService: CommitService,
    private readonly resourceService: ResourceService
  ) {}

  @Query(() => [Build])
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  async builds(@Args() args: FindManyBuildArgs): Promise<Build[]> {
    return this.service.findMany(args);
  }

  @Query(() => Build)
  @AuthorizeContext(AuthorizableOriginParameter.BuildId, "where.id")
  async build(@Args() args: FindOneBuildArgs): Promise<Build> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async createdBy(@Parent() build: Build): Promise<User> {
    if (!build.createdBy) {
      return this.userService.findUser({ where: { id: build.userId } }, true);
    }
    return build.createdBy;
  }

  @ResolveField()
  async action(@Parent() build: Build): Promise<Action> {
    if (!build.action) {
      return this.actionService.findOne({ where: { id: build.actionId } });
    }
    return build.action;
  }

  @ResolveField()
  async commit(@Parent() build: Build): Promise<Commit> {
    return this.commitService.findOne({ where: { id: build.commitId } });
  }

  @ResolveField()
  async resource(@Parent() build: Build): Promise<Resource> {
    if (build.resource === null) {
      return this.resourceService.resource({ where: { id: build.resourceId } });
    }
    return build.resource;
  }

  @ResolveField()
  archiveURI(@Parent() build: Build): string {
    return `/generated-apps/${build.id}.zip`;
  }

  @ResolveField()
  status(@Parent() build: Build): Promise<EnumBuildStatus> {
    if (this.service.isBuildStale(build)) {
      return this.service.calcBuildStatus(build.id);
    }

    if (build.status === EnumBuildStatus.Unknown) {
      return this.service.calcBuildStatus(build.id);
    }
    return Promise.resolve(EnumBuildStatus[build.status]);
  }

  @ResolveField(() => [BuildPlugin])
  buildPlugins(@Parent() build: Build): Promise<BuildPlugin[]> {
    return this.service.getBuildPlugins(build.id);
  }
}
