import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { PluginInstallationService } from "./pluginInstallation.service";
import { FindManyPluginInstallationArgs } from "./dto/FindManyPluginInstallationArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { PluginInstallation } from "./dto/PluginInstallation";
import { CreatePluginInstallationArgs } from "./dto/CreatePluginInstallationArgs";
import { UpdatePluginInstallationArgs } from "./dto/UpdatePluginInstallationArgs";
import { PluginOrder } from "./dto/PluginOrder";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { SetPluginOrderArgs } from "./dto/SetPluginOrderArgs";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";
import { FindOneArgs } from "../../dto";
import { PluginOrderService } from "./pluginOrder.service";
import { DeletePluginOrderArgs } from "./dto/DeletePluginOrderArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => PluginInstallation)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class PluginInstallationResolver extends BlockTypeResolver(
  PluginInstallation,
  "PluginInstallations",
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
