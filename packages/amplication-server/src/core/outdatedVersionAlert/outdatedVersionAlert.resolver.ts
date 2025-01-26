import { UseFilters, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { MetaQueryPayload } from "../../dto/MetaQueryPayload";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Block, Resource, User } from "../../models";
import { CommitService } from "../commit/commit.service";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { FindManyOutdatedVersionAlertArgs } from "./dto/FindManyOutdatedVersionAlertArgs";
import { FindOneOutdatedVersionAlertArgs } from "./dto/FindOneOutdatedVersionAlertArgs";
import { OutdatedVersionAlert } from "./dto/OutdatedVersionAlert";
import { OutdatedVersionAlertService } from "./outdatedVersionAlert.service";
import { UserEntity } from "../../decorators/user.decorator";
import { UpdateOutdatedVersionAlertArgs } from "./dto/UpdateOutdatedVersionAlertArgs";
import { BlockService } from "../block/block.service";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";

@Resolver(() => OutdatedVersionAlert)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class OutdatedVersionAlertResolver {
  constructor(
    private readonly service: OutdatedVersionAlertService,
    private readonly userService: UserService,
    private readonly commitService: CommitService,
    private readonly resourceService: ResourceService,
    private readonly blockService: BlockService
  ) {}

  @Query(() => [OutdatedVersionAlert])
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.resource.project.workspace.id"
  )
  async outdatedVersionAlerts(
    @Args() args: FindManyOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert[]> {
    return this.service.findMany(args);
  }

  @Query(() => MetaQueryPayload)
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.resource.project.workspace.id"
  )
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

  @Mutation(() => OutdatedVersionAlert, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.OutdatedVersionAlertId,
    "where.id",
    "resource.*.edit"
  )
  async updateOutdatedVersionAlert(
    @UserEntity() user: User,
    @Args() args: UpdateOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert> {
    return this.service.update(args, user);
  }

  @ResolveField(() => Resource, { nullable: false })
  async resource(
    @Parent() outdatedVersionAlert: OutdatedVersionAlert
  ): Promise<Resource> {
    return this.resourceService.resource({
      where: { id: outdatedVersionAlert.resourceId },
    });
  }

  @ResolveField(() => Block, { nullable: true })
  async block(@Parent() alert: OutdatedVersionAlert): Promise<Block> {
    if (!alert.blockId) {
      return null;
    }

    return this.blockService.block({
      where: {
        id: alert.blockId,
      },
    });
  }
}
