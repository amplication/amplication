import downloadHelper from "download";
import { packument } from "pacote";
import { PackageInstallation } from "./DynamicPackageInstallationManager";

export class Tarball {
  constructor(
    protected readonly plugin: PackageInstallation,
    private readonly modulesPath: string
  ) {}
  async download(): Promise<void> {
    const tarball = await this.packageTarball(this.plugin);
    const { name } = this.plugin;
    await downloadHelper(tarball, this.modulesPath, {
      extract: true,
      map(file) {
        file.path = file.path.replace("package/", `${name}/`);
        return file;
      },
    });
    return;
  }

  private async packageTarball({
    name,
    version,
  }: PackageInstallation): Promise<string> {
    const fullPackageName = `${name}@${version}`;
    const response = await packument(fullPackageName);
    const latestTag = response["dist-tags"].latest;
    const latest = response.versions[latestTag];
    if (!latest) {
      throw new Error(`Could not find latest version for ${fullPackageName}`);
    }

    return latest.dist.tarball;
  }
}
