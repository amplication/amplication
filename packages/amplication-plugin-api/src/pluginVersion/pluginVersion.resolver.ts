import * as graphql from "@nestjs/graphql";
import { PluginVersionResolverBase } from "./base/pluginVersion.resolver.base";
import { PluginVersion } from "./base/PluginVersion";
import { PluginVersionService } from "./pluginVersion.service";

@graphql.Resolver(() => PluginVersion)
export class PluginVersionResolver extends PluginVersionResolverBase {
  constructor(protected readonly service: PluginVersionService) {
    super(service);
  }
}
