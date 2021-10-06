import { satisfies } from "semver";
import { execSync } from "child_process";
async function main() {
  console.log("Setting up the project");
  preValidate();
  console.log("Finish pre validation successfully!");

  function preValidate() {
    const nodeVersion = process.versions.node;
    const { engines } = require("./package.json");
    const { node, npm } = engines;
    if (isValidNodeVersion(nodeVersion, node)) {
      console.info(`Pass node version with version: ${nodeVersion}`);
    } else {
      throw new Error("Invalid node version");
    }
    function isValidNodeVersion(
      nodeVersion: string,
      nodeRange: string
    ): boolean {
      if (!satisfies(nodeVersion, node)) {
        return false;
      } else {
        return true;
      }
    }
  }
}
if (require.main === module) {
  main();
}
