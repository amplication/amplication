import { packument } from "pacote";
import { valid } from "semver";
import { createWriteStream } from "fs";
import axios from "axios";

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
    this.validateOrThrowVersion(version);

    const tarball = await this.packageTarball({ name, version: validVersion });
    await this.downloadTarball(tarball);
  }

  async downloadTarball(tarball: string): Promise<void> {
    const writer = createWriteStream(this.pluginInstallationPath);

    const response = await axios(tarball, {
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  async packageTarball({ name, version }: PackageInstallation) {
    const fullPackageName = `${name}@${version}`;
    const response = await packument(fullPackageName);
    const latestTag = response["dist-tags"].latest;
    const latest = response.versions[latestTag];
    if (!latest) {
      throw new Error(`Could not find latest version for ${fullPackageName}`);
    }

    return latest.dist.tarball;
  }

  validateOrThrowVersion(version: string): Promise<void> {
    // if (validVersion === null) {
    //   throw new Error("Invalid version"); //TODO error class
    // }
    return;
  }
}

export interface PackageInstallation {
  name: string;
  version: string;
}
