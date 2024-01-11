import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { User } from "../../models";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreatePluginInstallationArgs } from "./dto/CreatePluginInstallationArgs";
import { DeletePluginOrderArgs } from "./dto/DeletePluginOrderArgs";
import { FindManyPluginInstallationArgs } from "./dto/FindManyPluginInstallationArgs";
import { PluginInstallation } from "./dto/PluginInstallation";
import { PluginOrder } from "./dto/PluginOrder";
import { SetPluginOrderArgs } from "./dto/SetPluginOrderArgs";
import { UpdatePluginInstallationArgs } from "./dto/UpdatePluginInstallationArgs";
import { PluginInstallationService } from "./pluginInstallation.service";
import { PluginOrderService } from "./pluginOrder.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

@Resolver(() => PluginInstallation)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class PluginInstallationResolver extends BlockTypeResolver(
  PluginInstallation,
  "pluginInstallations",
  FindManyPluginInstallationArgs,
  "createPluginInstallation",
  CreatePluginInstallationArgs,
  "updatePluginInstallation",
  UpdatePluginInstallationArgs,
  "deletePluginInstallation",
  DeletePluginOrderArgs
) {
  constructor(
    private readonly service: PluginInstallationService,
    private readonly pluginOrderService: PluginOrderService
  ) {
    super();
  }

  @Mutation(() => PluginOrder, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.id")
  async setPluginOrder(
    @Args() args: SetPluginOrderArgs,
    @UserEntity() user: User
  ): Promise<PluginOrder | null> {
    return this.service.setOrder(args, user);
  }

  @Query(() => PluginOrder, {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async pluginOrder(@Args() args: FindOneArgs): Promise<PluginOrder> {
    return this.pluginOrderService.findByResourceId(args);
  }

  @ResolveField(() => String)
  async version(
    @Parent() pluginInstallation: PluginInstallation
  ): Promise<string> {
    return pluginInstallation.version || "latest";
  }
}
