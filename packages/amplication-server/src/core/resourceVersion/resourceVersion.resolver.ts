import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Commit, Resource, User } from "../../models";
import { CommitService } from "../commit/commit.service";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { FindManyResourceVersionArgs } from "./dto/FindManyResourceVersionArgs";
import { FindOneResourceVersionArgs } from "./dto/FindOneResourceVersionArgs";
import { ResourceVersion } from "./dto/ResourceVersion";
import { ResourceVersionService } from "./resourceVersion.service";

@Resolver(() => ResourceVersion)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceVersionResolver {
  constructor(
    private readonly service: ResourceVersionService,
    private readonly userService: UserService,
    private readonly commitService: CommitService,
    private readonly resourceService: ResourceService
  ) {}

  @Query(() => [ResourceVersion])
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  async resourceVersions(
    @Args() args: FindManyResourceVersionArgs
  ): Promise<ResourceVersion[]> {
    return this.service.findMany(args);
  }

  @Query(() => ResourceVersion)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceVersionId, "where.id")
  async resourceVersion(
    @Args() args: FindOneResourceVersionArgs
  ): Promise<ResourceVersion> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async createdBy(@Parent() resourceVersion: ResourceVersion): Promise<User> {
    return this.userService.findUser(
      { where: { id: resourceVersion.userId } },
      true
    );
  }

  @ResolveField()
  async commit(@Parent() resourceVersion: ResourceVersion): Promise<Commit> {
    return this.commitService.findOne({
      where: { id: resourceVersion.commitId },
    });
  }

  @ResolveField()
  async resource(
    @Parent() resourceVersion: ResourceVersion
  ): Promise<Resource> {
    return this.resourceService.resource({
      where: { id: resourceVersion.resourceId },
    });
  }
}
