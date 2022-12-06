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
  await promiseFromChildProcess(
    exec(`npm i ${pluginInstallations.join(" ")} --no-save -f`)
  );
}
