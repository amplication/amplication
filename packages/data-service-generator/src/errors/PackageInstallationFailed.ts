export class PackageInstallationFailed extends Error {
  constructor(packageName: string) {
    super(`Failed to install package ${packageName}`);
  }
}
