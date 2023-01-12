import { PluginInstallation } from "@amplication/code-gen-types";
import { join } from "path";
import { AMPLICATION_MODULES } from "./main";
import { DynamicPackageInstallationManager } from "./utils/DynamicPackageInstallationManager";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[]
): Promise<void> {
  console.info("Installing dynamic packages");
  const manager = new DynamicPackageInstallationManager(
    join(__dirname, "..", AMPLICATION_MODULES)
  );

  await manager.installMany(
    packages.map(({ npm, version }) => ({ name: npm, version }))
  );

  return;
}
