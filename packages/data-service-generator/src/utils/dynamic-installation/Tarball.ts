import downloadHelper from "download";
import { join } from "path";
import { packument } from "pacote";
import { BuildLogger } from "@amplication/code-gen-types";
import { PackageInstallation } from "./DynamicPackageInstallationManager";
import fse from "fs-extra";

export class Tarball {
  constructor(
    protected readonly plugin: PackageInstallation,
    private readonly modulesPath: string,
    private readonly logger: BuildLogger
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

  filterFunc(src, dest) {
    if (src.includes("node_modules")) return false;

    return true;
  }

  async copySync({ folderPath }): Promise<void> {
    try {
      const { name } = this.plugin;
      fse.copySync(folderPath, join(this.modulesPath, name), {
        overwrite: true,
        filter: this.filterFunc,
      });
    } catch (error: any) {
      await this.logger.error("fse.copySync", {}, "", error);
    }
  }

  private async packageTarball({
    name,
    version,
  }: PackageInstallation): Promise<string> {
    const fullPackageName = `${name}@${version}`;
    const response = await packument(fullPackageName);
    const latestTag = response["dist-tags"].latest;
    const latestVersion = response.versions[latestTag];
    const requestedVersion = response.versions[version];

    if (!version || version === "latest") {
      return latestVersion.dist.tarball;
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

    return requestedVersion.dist.tarball;
  }
}
