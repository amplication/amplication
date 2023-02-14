import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { PluginVersionResolverBase } from "./base/pluginVersion.resolver.base";
import { PluginVersion } from "./base/PluginVersion";
import { PluginVersionService } from "./pluginVersion.service";

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
}
