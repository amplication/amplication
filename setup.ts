import check from "check-node-version";
import { exec } from "child_process";
import { createLogger, format, Logger, transports } from "winston";
const { combine, colorize, simple } = format;

async function main(args: string[]) {
  class TasksRunner {
    constructor(private logger: Logger) {}
    async run(
      taskName: string,
      taskFinishMessage: string,
      execFunction: Function
    ) {
      try {
        this.logger.profile(taskName);
        await execFunction();
        this.logger.info(`Finish the ${taskFinishMessage} ✅`);
        this.logger.profile(taskName, {
          level: "debug",
          message: `Finish the ${taskFinishMessage}`,
        });
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
  const [bin, file, detailed] = args;
  const detailedValue = detailed.slice(detailed.indexOf("=") + 1) === "true";
  const logger = createLogger({
    transports: [new transports.Console()],
    format: combine(colorize(), simple()),
  });
  logger.info("Start Setting up the project");
  const taskRunner = new TasksRunner(logger);
  await taskRunner.run(
    "pre validation",
    "pre validation successfully!",
    preValidate
  );
  logger.warn(
    "Starting npm run bootstrap its take a lot of time, be patient dont close the process in the middle"
  );
  await taskRunner.run("bootstrap", "lerna bootstrap", runBootstrap);
  await Promise.all([
    taskRunner.run("prisma", "prisma generation", runPrismaGenerate),
    taskRunner.run("build", "build of all the server dependencies", runBuild),
  ]);
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
  await Promise.all([generatePromise]);
  logger.info("Finish all the process for the setup, have fun hacking 🎉");

  async function buildClient() {}
  //#region functions
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

  async function preValidate() {
    return new Promise((resolve, reject) => {
      const { engines } = require("./package.json");
      const { node: nodeRange, npm } = engines;
      check({ npm: npm, node: nodeRange }, (error, result) => {
        if (error) {
          reject("Unknown error accord in the setup process");
        }
        if (!result.versions.node.isSatisfied)
          reject(
            `Invalid node version, please use the specified node version ${nodeRange}`
          );
        if (!result.versions.npm.isSatisfied)
          reject(
            `Invalid npm version, please use the specified npm version ${npm}`
          );
        resolve(null);
      });
    });
  }

  async function getAllPackageJSONFiles() {}
}

if (require.main === module) {
  main(process.argv);
}
