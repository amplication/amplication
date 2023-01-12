import { valid } from "semver";
import type { Promisable } from "type-fest";
import { Tarball } from "./Tarball";
export class DynamicPackageInstallationManager {
  constructor(private pluginInstallationPath: string) {}

  async install(
    plugin: PackageInstallation,
    hooks: {
      before?: HookFunction;
      after?: HookFunction;
      crash?: HookFunction;
    }
  ): Promise<void> {
    const { after, before, crash } = hooks;

    try {
      const { name, version } = plugin;
      before ?? (await before(plugin));
      const validVersion = valid(version);

      const tarball = new Tarball(
        { name, version: validVersion },
        this.pluginInstallationPath
      );
      await tarball.download();
      after ?? (await after(plugin));
    } catch (error) {
      crash ?? (await crash(plugin));
      throw error;
    }

    return;
  }
}

export interface PackageInstallation {
  name: string;
  version: string;
}

export type HookFunction = (plugin: PackageInstallation) => Promisable<void>;
