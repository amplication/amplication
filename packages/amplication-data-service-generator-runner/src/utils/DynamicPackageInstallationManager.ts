import { valid } from "semver";
import { Tarball } from "./Tarball";
export class DynamicPackageInstallationManager {
  constructor(private pluginInstallationPath: string) {}

  async installMany(packages: PackageInstallation[]): Promise<void> {
    for (const plugin of packages) {
      await this.install(plugin);
    }
    return;
  }

  async install({ name, version }: PackageInstallation): Promise<void> {
    const validVersion = valid(version);

    const tarball = new Tarball(
      { name, version: validVersion },
      this.pluginInstallationPath
    );
    await tarball.download();
  }
}

export interface PackageInstallation {
  name: string;
  version: string;
}
