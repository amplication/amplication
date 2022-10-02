import { promises as fs } from "fs";
import path from "path";
import semver from "semver";

const TARGET_FOLDER = process.env.TARGET_FOLDER;

if (!TARGET_FOLDER) {
  throw new Error("TARGET_FOLDER environment variable is not set");
}

enum DependencyStatus {
  OK = "OK",
  CONFLICT = "CONFLICT",
}

async function main() {
  console.log({ TARGET_FOLDER });

  const root = JSON.parse(
    await fs.readFile(path.resolve(__dirname, "package.json"), "utf-8")
  );

  const target = JSON.parse(
    await fs.readFile(
      path.resolve(TARGET_FOLDER as string, "package.json"),
      "utf-8"
    )
  );

  const {
    dependencies: rootDependencies,
    devDependencies: rootDevDependencies,
  } = root;

  const {
    dependencies: targetDependencies,
    devDependencies: targetDevDependencies,
  } = target;

  // Start scanning
  const dependenciesResult = calculateDependenciesStatus(
    rootDependencies,
    targetDependencies
  );
  const devDependenciesResult = calculateDependenciesStatus(
    rootDevDependencies,
    targetDevDependencies
  );

  const report = {
    dependencies: dependenciesResult,
    devDependencies: devDependenciesResult,
  };

  const conflictingPackages = {
    dependencies: Object.values(report.dependencies).filter(
      (d: any) => d.status === DependencyStatus.CONFLICT
    ),
    devDependencies: Object.values(report.devDependencies).filter(
      (d: any) => d.status === DependencyStatus.CONFLICT
    ),
  };

  let installCmdDependencies = `npm install`;
  let installCmdDevDependencies = `npm install -D`;

  Object.values(report.dependencies)
    .filter((d: any) => d.status === DependencyStatus.OK && !d.rootValue)
    .filter((d: any) => !d.name.includes("@amplication/"))
    .forEach(
      (d: any) =>
        (installCmdDependencies += ` ${d.name}@^${d.targetValue.replace(
          "^",
          ""
        )}`)
    );
  Object.values(report.devDependencies)
    .filter((d: any) => d.status === DependencyStatus.OK && !d.rootValue)
    .filter((d: any) => !d.name.includes("@amplication/"))
    .forEach(
      (d: any) =>
        (installCmdDevDependencies += ` ${d.name}@^${d.targetValue.replace(
          "^",
          ""
        )}`)
    );

  console.log(JSON.stringify(conflictingPackages, null, 2));
  console.log({ installCmdDependencies, installCmdDevDependencies });
}

function calculateDependenciesStatus(root: any, target: any) {
  const result: any = {};

  for (let [key, value] of Object.entries(target)) {
    key = key as string;
    value = value as string;

    const rootDependency = root[key];

    if (!rootDependency) {
      result[key] = {
        name: key,
        status: DependencyStatus.OK,
        rootValue: null,
        targetValue: value,
        reason: "Dependency is not present in root package.json",
      };
      continue;
    }

    if (semver.satisfies(value as string, rootDependency)) {
      result[key] = {
        name: key,
        status: DependencyStatus.OK,
        rootValue: rootDependency,
        targetValue: value,
        value,
        reason: "Dependency is present in root package.json, satisfies version",
      };
    } else {
      result[key] = {
        name: key,
        status: DependencyStatus.CONFLICT,
        rootValue: rootDependency,
        targetValue: value,
        reason:
          "Dependency is present in root package.json, but version is not satisfied",
      };
    }
  }

  return result;
}

main();
