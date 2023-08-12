import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import { groupBy } from "lodash";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { PluginResolverBase } from "./base/plugin.resolver.base";
import { Plugin } from "./base/Plugin";
import { PluginService } from "./plugin.service";
import { Public } from "../decorators/public.decorator";
import { GraphQLError } from "graphql";
import { PluginVersion } from "../pluginVersion/base/PluginVersion";
import { PluginVersionService } from "../pluginVersion/pluginVersion.service";
import { ProcessedPluginVersions } from "./plugin.types";
import { PluginVersionFindManyArgs } from "../pluginVersion/base/PluginVersionFindManyArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@graphql.Resolver(() => Plugin)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class PluginResolver extends PluginResolverBase {
  constructor(
    protected readonly service: PluginService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly pluginVersionService: PluginVersionService,
    @common.Inject(AmplicationLogger) readonly logger: AmplicationLogger
  ) {
    super(service, rolesBuilder);
  }

  @Public()
  @graphql.Mutation(() => [Plugin], { nullable: true })
  async processPluginCatalog(): Promise<ProcessedPluginVersions[]> {
    const startTime = new Date().getTime();

    try {
      const amplicationPlugins = await this.service.processCatalogPlugins();
      if (
        Object.prototype.toString.call(amplicationPlugins) === "[object String]"
      ) {
        throw amplicationPlugins;
      }

      const npmPluginsVersions =
        await this.pluginVersionService.processPluginsVersions(
          amplicationPlugins
        );

      const npmPluginsVersionsMap = groupBy(
        npmPluginsVersions,
        (version) => version.pluginId
      );

      this.logger.debug("processPluginCatalog", {
        timeToProcessPluginCatalog: (new Date().getTime() - startTime) / 1000,
      });

      return amplicationPlugins.map((plugin) => {
        return {
          ...plugin,
          versions: npmPluginsVersionsMap[plugin.id],
        };
      });
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
  async versions(
    @graphql.Parent() parent: Plugin,
    @graphql.Args() args: PluginVersionFindManyArgs
  ): Promise<PluginVersion[]> {
    return this.pluginVersionService.findMany({
      ...args,
      where: {
        ...args.where,
        pluginId: {
          equals: parent.pluginId,
        },
      },
    });
  }
}
