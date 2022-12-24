import { PluginInstallation } from "@amplication/code-gen-types";
import { AlternativeImportFunction } from "@amplication/data-service-generator/register-plugin";
import { join } from "path";
import { DynamicPackageInstallationManager } from "./utils/DynamicPackageInstallationManager";

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

export const pluginCustomPluginsGetterFunction: AlternativeImportFunction = (
  packageName: string
) => {
  return join(__dirname, "..", "amplication_modules", packageName);
};
