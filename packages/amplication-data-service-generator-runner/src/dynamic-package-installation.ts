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

  for (const plugin of packages) {
    const { npm, version } = plugin;
    manager.install(npm, version);
    // await npmInstall(tarballLink);
  }

  return;
}
