import { PluginInstallation } from "@amplication/code-gen-types";
import { join } from "path";
import { DynamicPackageInstallationManager } from "./DynamicPackageInstallationManager";

export async function dynamicPackagesInstallations(
  packages: PluginInstallation[]
): Promise<void> {
  console.info("Installing dynamic packages");
  const manager = new DynamicPackageInstallationManager(
    join(__dirname, "..", "amplication_modules")
  );

  await manager.installMany(
    packages.map(({ npm, version }) => ({ name: npm, version }))
  );

  return;
}
