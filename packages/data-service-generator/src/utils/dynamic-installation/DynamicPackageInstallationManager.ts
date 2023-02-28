import { valid } from "semver";
import type { Promisable } from "type-fest";
import { Tarball } from "./Tarball";
export class DynamicPackageInstallationManager {
  constructor(private pluginInstallationPath: string) {}

  public async install(
    plugin: PackageInstallation,
    hooks: {
      onBeforeInstall?: HookFunction;
      onAfterInstall?: HookFunction;
      onError?: HookFunction;
    }
  ): Promise<void> {
    const { onAfterInstall, onBeforeInstall, onError } = hooks;

    try {
      const { name, version, settings, pluginId } = plugin;
      onBeforeInstall && (await onBeforeInstall(plugin));
      const validVersion = valid(version);

      const tarball = new Tarball(
        { name, version: validVersion, settings, pluginId },
        this.pluginInstallationPath
      );

      if (settings?.local) {
        await tarball.copySync({ folderPath: settings.destPath });
      } else {
        await tarball.download();
        onAfterInstall && (await onAfterInstall(plugin));
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
  settings: { [key: string]: any };
}

export type HookFunction = (plugin: PackageInstallation) => Promisable<void>;
