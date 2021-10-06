import { exec } from "child_process";
import { satisfies } from "semver";
import { createLogger, format, Logger, transports } from "winston";
const { printf, combine, colorize, simple } = format;

async function main() {
  const logger = createLogger({
    transports: [new transports.Console()],
    format: combine(colorize(), simple()),
  });
  logger.info("Start Setting up the project");
  const nodeVersion = process.versions.node;
  const { engines } = require("./package.json");
  const { node, npm } = engines;
  logger.profile("validation");
  preValidate(logger, nodeVersion, node);
  logger.profile("validation", {
    message: "Finish pre validation successfully!",
    level: "info",
  });
  const taskRunner = new TasksRunner(logger);
  await taskRunner.run("bootstrap", "lerna bootstrap", runBootstrap);
  const prismaPromise = taskRunner.run(
    "prisma",
    "prisma generation",
    runPrismaGenerate
  );
  const buildPromise = taskRunner.run(
    "build",
    "build of all the server dependencies",
    runBuild
  );
  await Promise.all([prismaPromise, buildPromise]);
  const generatePromise = taskRunner.run(
    "generate",
    "generate of all graphql schemas",
    runGenerate
  );
  await taskRunner.run(
    "docker",
    "starting up of the docker compose",
    runDocker
  );
  await taskRunner.run(
    "docker-init",
    "init of the docker and the seed",
    runInitDocker
  );
}

class TasksRunner {
  constructor(private logger: Logger) {}
  async run(
    taskName: string,
    taskFinishMessage: string,
    execFunction: Function
  ) {
    this.logger.profile(taskName);
    await execFunction();
    this.logger.info(`Finish the ${taskFinishMessage}`);
    this.logger.profile(taskName, {
      level: "debug",
      message: `Finish the ${taskFinishMessage}`,
    });
  }
}

//#region  functions
async function runBootstrap() {
  return new Promise((resolve, reject) => {
    const bootstrap = exec("npm run bootstrap", (error, stdout, stderr) => {
      error && reject(error);
      stdout && resolve(true);
    });
  });
}

async function runPrismaGenerate() {
  return new Promise((resolve, reject) => {
    const runPrismaGenerate = exec(
      "npm run prisma:generate",
      (error, stdout, stderr) => {
        error && reject(error);
        stdout && resolve(true);
      }
    );
  });
}
async function runBuild() {
  return new Promise((resolve, reject) => {
    exec(
      "npm run build -- --scope @amplication/server --include-dependencies",
      (error, stdout, stderr) => {
        error && reject(error);
        stdout && resolve(true);
      }
    );
  });
}
async function runGenerate() {
  return new Promise((resolve, reject) => {
    exec("npm run generate", (error, stdout, stderr) => {
      error && reject(error);
      stdout && resolve(true);
    });
  });
}
async function runDocker() {
  return new Promise((resolve, reject) => {
    exec(
      "cd packages/amplication-server && npm run docker",
      (error, stdout, stderr) => {
        error && reject(error);
        stdout && resolve(true);
      }
    );
  });
}
async function runInitDocker() {
  return new Promise((resolve, reject) => {
    exec(
      "cd packages/amplication-server && npm run start:db",
      (error, stdout, stderr) => {
        error && reject(error);
        stdout && resolve(true);
      }
    );
  });
}

function preValidate(logger: Logger, nodeVersion, nodeRange) {
  if (isValidNodeVersion(nodeVersion, nodeRange)) {
    logger.info(`Pass node version test with version: ${nodeVersion}`);
  } else {
    throw new Error(
      `Invalid node version, please use the specified node version ${nodeRange}`
    );
  }
}
//#endregion
function isValidNodeVersion(nodeVersion: string, nodeRange: string): boolean {
  if (!satisfies(nodeVersion, nodeRange)) {
    return false;
  } else {
    return true;
  }
}
if (require.main === module) {
  main();
}
