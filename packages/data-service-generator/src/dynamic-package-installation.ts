import { PluginInstallation } from "@amplication/code-gen-types";
import { join } from "path";
import { AMPLICATION_MODULES } from "./main";
import {
  DynamicPackageInstallationManager,
  PackageInstallation,
} from "./utils/dynamic-installation/DynamicPackageInstallationManager";
import { Logger } from "winston";
import { createLog } from "./create-log";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[],
  logger: Logger
): Promise<void> {
  console.info("Installing dynamic packages");
  const manager = new DynamicPackageInstallationManager(
    join(__dirname, "..", AMPLICATION_MODULES)
  );

  for (const plugins of packages) {
    const plugin: PackageInstallation = {
      name: plugins.npm,
      version: plugins.version,
      settings: plugins.settings,
      pluginId: plugins.pluginId,
    };
    await manager.install(plugin, {
      onBeforeInstall: async (plugin) => {
        logger.info(`Installing Plugin: ${plugin.name}@${plugin.version}`);
        await createLog({
          level: "info",
          message: `Installing Plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      onAfterInstall: async (plugin) => {
        logger.info(
          `Successfully Installed plugin: ${plugin.name}@${plugin.version}`
        );
        await createLog({
          level: "info",
          message: `Successfully Installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      onError: async (plugin) => {
        logger.error(
          `Failed to installed plugin: ${plugin.name}@${plugin.version}`
        );
        await createLog({
          level: "error",
          message: `Failed to installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
    });
  }

  return;
}
