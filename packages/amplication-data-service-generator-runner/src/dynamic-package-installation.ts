import { PluginInstallation } from "@amplication/code-gen-types";
import { createLog } from "@amplication/data-service-generator";
import { join } from "path";
import { AMPLICATION_MODULES } from "./main";
import {
  DynamicPackageInstallationManager,
  PackageInstallation,
} from "./utils/DynamicPackageInstallationManager";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[]
): Promise<void> {
  console.info("Installing dynamic packages");
  const manager = new DynamicPackageInstallationManager(
    join(__dirname, "..", AMPLICATION_MODULES)
  );

  for (const plugins of packages) {
    const plugin: PackageInstallation = {
      name: plugins.npm,
      version: plugins.version,
    };
    await manager.install(plugin, {
      onBeforeInstall: async (plugin) => {
        await createLog({
          level: "info",
          message: `Installing Plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      onAfterInstall: async (plugin) => {
        await createLog({
          level: "info",
          message: `Successfully Installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      onError: async (plugin) => {
        await createLog({
          level: "error",
          message: `Failed to installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
    });
  }

  return;
}
