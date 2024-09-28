import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreatePrivatePluginArgs } from "./dto/CreatePrivatePluginArgs";
import { DeletePrivatePluginArgs } from "./dto/DeletePrivatePluginArgs";
import { FindManyPrivatePluginArgs } from "./dto/FindManyPrivatePluginArgs";
import { PrivatePlugin } from "./dto/PrivatePlugin";
import { UpdatePrivatePluginArgs } from "./dto/UpdatePrivatePluginArgs";
import { PrivatePluginService } from "./privatePlugin.service";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserEntity } from "../../decorators/user.decorator";
import { CreatePrivatePluginVersionArgs } from "./dto/CreatePrivatePluginVersionArgs";
import { PrivatePluginVersion } from "./dto/PrivatePluginVersion";
import { UpdatePrivatePluginVersionArgs } from "./dto/UpdatePrivatePluginVersionArgs";
import { User } from "../../models";

@Resolver(() => PrivatePlugin)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class PrivatePluginResolver extends BlockTypeResolver(
  PrivatePlugin,
  "privatePlugins",
  FindManyPrivatePluginArgs,
  "createPrivatePlugin",
  CreatePrivatePluginArgs,
  "updatePrivatePlugin",
  UpdatePrivatePluginArgs,
  "deletePrivatePlugin",
  DeletePrivatePluginArgs
) {
  constructor(private readonly service: PrivatePluginService) {
    super();
  }

  @Query(() => [PrivatePlugin])
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  @UseGuards(GqlAuthGuard)
  async availablePrivatePluginsForResource(
    @Args() args: FindManyPrivatePluginArgs
  ): Promise<PrivatePlugin[]> {
    return this.service.availablePrivatePluginsForResource(args);
  }

  @Mutation(() => PrivatePluginVersion, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlockId,
    "data.moduleDto.connect.id"
  )
  async createPrivatePluginVersion(
    @UserEntity() user: User,
    @Args() args: CreatePrivatePluginVersionArgs
  ): Promise<PrivatePluginVersion> {
    return this.service.createVersion(args, user);
  }

  @Mutation(() => PrivatePluginVersion, {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.moduleDto.id")
  async updatePrivatePluginVersion(
    @UserEntity() user: User,
    @Args() args: UpdatePrivatePluginVersionArgs
  ): Promise<PrivatePluginVersion> {
    return this.service.updateVersion(args, user);
  }
}
