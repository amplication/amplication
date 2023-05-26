import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { PluginVersionResolverBase } from "./base/pluginVersion.resolver.base";
import { PluginVersion } from "./base/PluginVersion";
import { PluginVersionService } from "./pluginVersion.service";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => PluginVersion)
export class PluginVersionResolver extends PluginVersionResolverBase {
  constructor(
    protected readonly service: PluginVersionService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
