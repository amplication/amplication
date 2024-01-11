import { PluginVersion } from "./base/PluginVersion";
import { PluginVersionResolverBase } from "./base/pluginVersion.resolver.base";
import { PluginVersionService } from "./pluginVersion.service";
import * as graphql from "@nestjs/graphql";

@graphql.Resolver(() => PluginVersion)
export class PluginVersionResolver extends PluginVersionResolverBase {
  constructor(protected readonly service: PluginVersionService) {
    super(service);
  }
}
