import { PluginInstallation } from "@amplication/code-gen-types";
import { createLog } from "@amplication/data-service-generator/create-log";
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
      before: async (plugin) => {
        await createLog({
          level: "info",
          message: `Installing Plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      after: async (plugin) => {
        await createLog({
          level: "info",
          message: `Successfully Installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
      crash: async (plugin) => {
        await createLog({
          level: "error",
          message: `Failed to installed plugin: ${plugin.name}@${plugin.version}`,
        });
      },
    });
  }

  return;
}
