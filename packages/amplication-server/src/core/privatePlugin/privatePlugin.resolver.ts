import { UseFilters, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
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
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { FindOneArgs } from "../../dto";
import { GitFolderContent } from "../git/dto/objects/GitFolderContent";

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

  @Query(() => GitFolderContent)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  @UseGuards(GqlAuthGuard)
  async pluginRepositoryRemotePlugins(
    @Args() args: FindOneArgs
  ): Promise<GitFolderContent> {
    return this.service.getPrivatePluginListFromRemoteRepository(args.where);
  }

  @Mutation(() => PrivatePluginVersion, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlockId,
    "data.privatePlugin.connect.id",
    "privatePlugin.version.create"
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
  @AuthorizeContext(
    AuthorizableOriginParameter.BlockId,
    "where.privatePlugin.id",
    "privatePlugin.version.edit"
  )
  async updatePrivatePluginVersion(
    @UserEntity() user: User,
    @Args() args: UpdatePrivatePluginVersionArgs
  ): Promise<PrivatePluginVersion> {
    return this.service.updateVersion(args, user);
  }

  @ResolveField(() => User)
  async versions(
    @Parent() privatePlugin: PrivatePlugin
  ): Promise<PrivatePluginVersion[]> {
    if (!privatePlugin.versions) {
      return [];
    } else {
      return privatePlugin.versions;
    }
  }

  @ResolveField(() => EnumCodeGenerator)
  async codeGenerator(
    @Parent() privatePlugin: PrivatePlugin
  ): Promise<keyof typeof EnumCodeGenerator> {
    if (!privatePlugin.codeGenerator) {
      return EnumCodeGenerator.DotNet;
    } else {
      return privatePlugin.codeGenerator;
    }
  }
}
