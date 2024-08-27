import { PluginInstallation } from "@amplication/code-gen-types";
import {
  DynamicPackageInstallationManager,
  PackageInstallation,
} from "./utils/dynamic-installation/DynamicPackageInstallationManager";
import { ILogger } from "@amplication/util-logging";
import DsgContext from "./dsg-context";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[],
  pluginInstallationPath: string,
  logger: ILogger
): Promise<void> {
  logger.info("Installing dynamic packages");

  const context = DsgContext.getInstance;

  const manager = new DynamicPackageInstallationManager(
    pluginInstallationPath,
    context.logger
  );

  for (const plugins of packages.filter((plugin) => !plugin.isPrivate)) {
    const plugin: PackageInstallation = {
      name: plugins.npm,
      version: plugins.version,
      settings: plugins.settings,
      pluginId: plugins.pluginId,
    };
    await manager.install(plugin, {
      onBeforeInstall: async (plugin) => {
        await context.logger.info(
          `Installing plugin: ${plugin.name}@${plugin.version}`
        );
      },
      onAfterInstall: async (plugin) => {
        await context.logger.info(
          `Successfully installed plugin: ${plugin.name}@${plugin.version}`
        );
      },
      onError: async (plugin, error) => {
        await context.logger.error(
          `Failed to installed plugin: ${plugin.name}@${plugin.version}`,
          { ...error }
        );
      },
    });
  }

  return;
}
