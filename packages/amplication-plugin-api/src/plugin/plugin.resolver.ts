import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { PluginResolverBase } from "./base/plugin.resolver.base";
import { Plugin } from "./base/Plugin";
import { PluginService } from "./plugin.service";
import { Public } from "../decorators/public.decorator";
import { GraphQLError } from "graphql";
import { PluginVersion } from "../pluginVersion/base/PluginVersion";

@graphql.Resolver(() => Plugin)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class PluginResolver extends PluginResolverBase {
  constructor(
    protected readonly service: PluginService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @Public()
  @graphql.Query(() => [Plugin], { nullable: true })
  async githubPlugins(): Promise<Plugin[]> {
    try {
      const amplicationPlugins = await this.service.githubCatalogPlugins();
      if (
        Object.prototype.toString.call(amplicationPlugins) === "[object String]"
      )
        throw amplicationPlugins;

      return amplicationPlugins;
    } catch (error) {
      throw new GraphQLError(error.message, null, null, null, null, null, {
        extensions: {
          code: "SOMETHING_BAD_HAPPENED",
          http: {
            status: 400,
          },
        },
      });
    }
  }

  @Public()
  @graphql.ResolveField(() => [PluginVersion], { nullable: true })
  async versions(@graphql.Parent() parent: Plugin): Promise<PluginVersion[]> {
    return this.service.pluginVersions(parent);
  }
}
