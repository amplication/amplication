import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { PluginVersionResolverBase } from "./base/pluginVersion.resolver.base";
import { PluginVersion } from "./base/PluginVersion";
import { PluginVersionService } from "./pluginVersion.service";
import { Public } from "../decorators/public.decorator";
import { GraphQLError } from "graphql";

@graphql.Resolver(() => PluginVersion)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class PluginVersionResolver extends PluginVersionResolverBase {
  constructor(
    protected readonly service: PluginVersionService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @Public()
  @graphql.Query(() => [PluginVersion])
  async pluginsVersions(): Promise<PluginVersion[]> {
    try {
      const npmPluginsVersions = await this.service.npmPluginsVersions();
      if (!npmPluginsVersions) throw "Failed to update plugins versions";

      return npmPluginsVersions;
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
}
