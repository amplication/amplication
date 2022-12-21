import { packument } from "pacote";
import { valid } from "semver";

export class DynamicPackageInstallationManager {
  async install(packageName: string, version: string) {
    const validVersion = valid(version);
    if (validVersion === null) {
      throw new Error("Invalid version"); //TODO error class
    }
    const tarball = this.packageTarball(packageName, validVersion);
  }

  async packageTarball(packageName: string, version: string) {
    const fullPackageName = `${packageName}@${version}`;
    const response = await packument(fullPackageName);
    const latestTag = response["dist-tags"].latest;
    const latest = response.versions[latestTag];
    if (!latest) {
      throw new Error(`Could not find latest version for ${fullPackageName}`);
    }

    return latest.dist.tarball;
  }
}
