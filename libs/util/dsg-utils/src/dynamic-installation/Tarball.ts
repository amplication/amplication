import downloadHelper from "download";
import { packument } from "pacote";
import { BuildLogger } from "@amplication/code-gen-types";
import {
  InstalledPluginVersion,
  PackageInstallation,
} from "./DynamicPackageInstallationManager";

export class Tarball {
  constructor(
    protected readonly plugin: PackageInstallation,
    private readonly modulesPath: string,
    private readonly logger: BuildLogger
  ) {}
  async download(): Promise<InstalledPluginVersion> {
    const tarball = await this.packageTarball(this.plugin);
    const { name } = this.plugin;
    await downloadHelper(tarball.tarball, this.modulesPath, {
      extract: true,
      map(file) {
        file.path = file.path.replace("package/", `${name}/`);
        return file;
      },
    });
    return tarball.version;
  }

  private async packageTarball({
    name,
    version,
  }: PackageInstallation): Promise<{
    tarball: string;
    version: InstalledPluginVersion;
  }> {
    const fullPackageName = `${name}@${version}`;
    const response = await packument(fullPackageName);
    const latestTag = response["dist-tags"].latest;
    const latestVersion = response.versions[latestTag];
    const requestedVersion = response.versions[version || ""];

    if (!version || version === "latest") {
      return {
        tarball: latestVersion.dist.tarball,
        version: {
          requestedFullPackageName: fullPackageName,
          packageName: name,
          packageVersion: latestVersion.version,
        },
      };
    }

    if (!requestedVersion.version) {
      const suggestionMessage = `Please try to install another version, or the latest version: ${latestVersion}.`;
      await this.logger.error(
        [`${name}@${version} is not available`, suggestionMessage].join(". ")
      );

      throw new Error(
        [
          `Could not find version ${version} for ${name}`,
          suggestionMessage,
        ].join(". ")
      );
    }

    if (requestedVersion.deprecated) {
      await this.logger.warn(
        `${name}@${version} is deprecated, update it to avoid issues in the code generation.`
      );
    }

    return {
      tarball: requestedVersion.dist.tarball,
      version: {
        requestedFullPackageName: fullPackageName,
        packageName: name,
        packageVersion: requestedVersion.version,
      },
    };
  }
}
