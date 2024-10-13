import { BuildLogger } from "@amplication/code-gen-types";
import { valid } from "semver";
import type { Promisable } from "type-fest";
import { Tarball } from "./Tarball";
export class DynamicPackageInstallationManager {
  constructor(
    private pluginInstallationPath: string,
    private readonly logger: BuildLogger
  ) {}

  public async install(
    plugin: PackageInstallation,
    hooks: {
      onBeforeInstall?: HookFunction;
      onAfterInstall?: HookSuccessFunction;
      onError?: HookErrorFunction;
    }
  ): Promise<void> {
    const { onAfterInstall, onBeforeInstall, onError } = hooks;

    try {
      const { name, version, settings, pluginId } = plugin;
      onBeforeInstall && (await onBeforeInstall(plugin));
      const validVersion = valid(version);

      const tarball = new Tarball(
        { name, version: validVersion, settings, pluginId },
        this.pluginInstallationPath,
        this.logger
      );

      if (!settings?.local) {
        const installedVersion = await tarball.download();
        onAfterInstall &&
          (await onAfterInstall(plugin, {
            ...installedVersion,
            requestedFullPackageName: `${name}@${version}`, //use the original requested version
          }));
      }
    } catch (error) {
      onError && (await onError(plugin));
      throw error;
    }

    return;
  }
}

export interface PackageInstallation {
  name: string;
  version: string | null;
  pluginId: string;
  settings: {
    local?: boolean;
    destPath?: string;
    [key: string]: any;
  };
}

export interface InstalledPluginVersion {
  requestedFullPackageName: string;
  packageName: string;
  packageVersion: string;
}

export type HookFunction = (plugin: PackageInstallation) => Promisable<void>;
export type HookSuccessFunction = (
  plugin: PackageInstallation,
  installedPluginVersion: InstalledPluginVersion
) => Promisable<void>;

export type HookErrorFunction = (
  plugin: PackageInstallation,
  error?: Error
) => Promisable<void>;
