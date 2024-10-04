import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { MetaQueryPayload } from "../../dto/MetaQueryPayload";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource } from "../../models";
import { CommitService } from "../commit/commit.service";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { FindManyOutdatedVersionAlertArgs } from "./dto/FindManyOutdatedVersionAlertArgs";
import { FindOneOutdatedVersionAlertArgs } from "./dto/FindOneOutdatedVersionAlertArgs";
import { OutdatedVersionAlert } from "./dto/OutdatedVersionAlert";
import { OutdatedVersionAlertService } from "./outdatedVersionAlert.service";

@Resolver(() => OutdatedVersionAlert)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class OutdatedVersionAlertResolver {
  constructor(
    private readonly service: OutdatedVersionAlertService,
    private readonly userService: UserService,
    private readonly commitService: CommitService,
    private readonly resourceService: ResourceService
  ) {}

  @Query(() => [OutdatedVersionAlert])
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  async outdatedVersionAlerts(
    @Args() args: FindManyOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert[]> {
    return this.service.findMany(args);
  }
  @Query(() => MetaQueryPayload)
  async _outdatedVersionAlertsMeta(
    @Args() args: FindManyOutdatedVersionAlertArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @Query(() => OutdatedVersionAlert)
  @AuthorizeContext(
    AuthorizableOriginParameter.OutdatedVersionAlertId,
    "where.id"
  )
  async outdatedVersionAlert(
    @Args() args: FindOneOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async resource(
    @Parent() outdatedVersionAlert: OutdatedVersionAlert
  ): Promise<Resource> {
    return this.resourceService.resource({
      where: { id: outdatedVersionAlert.resourceId },
    });
  }
}
