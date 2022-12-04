import { ChildProcess, exec } from "child_process";
import { PackageInstallationFailed } from "../src/errors/PackageInstallationFailed";

function promiseFromChildProcess(child: ChildProcess) {
  return new Promise(function (resolve, reject) {
    child.addListener("error", reject);
    child.addListener("exit", resolve);
  });
}

export async function dynamicPluginInstallation(
  pluginInstallations: string[]
): Promise<void> {
  for await (const plugin of pluginInstallations) {
    await installationPackage(plugin);
  }
}

async function installationPackage(packageName: string): Promise<void> {
  try {
    await promiseFromChildProcess(exec(`npm i ${packageName}`));
  } catch (error) {
    throw new PackageInstallationFailed(packageName);
  }
}
