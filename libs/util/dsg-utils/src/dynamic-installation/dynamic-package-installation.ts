import { PluginInstallation } from "@amplication/code-gen-types";
import { DynamicPackageInstallationManager, PackageInstallation } from "../";
import { ILogger } from "@amplication/util-logging";
import { BuildLogger as IBuildLogger } from "@amplication/code-gen-types";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[],
  pluginInstallationPath: string,
  logger: ILogger,
  buildLogger: IBuildLogger
): Promise<void> {
  logger.info("Installing dynamic packages");

  const manager = new DynamicPackageInstallationManager(
    pluginInstallationPath,
    buildLogger
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
        await buildLogger.info(
          `Installing plugin: ${plugin.name}@${plugin.version}`
        );
      },
      onAfterInstall: async (plugin) => {
        await buildLogger.info(
          `Successfully installed plugin: ${plugin.name}@${plugin.version}`
        );
      },
      onError: async (plugin, error) => {
        await buildLogger.error(
          `Failed to installed plugin: ${plugin.name}@${plugin.version}`,
          { ...error }
        );
      },
    });
  }

  return;
}
