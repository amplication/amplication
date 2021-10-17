import check from "check-node-version";
import { exec } from "child_process";
import { createLogger, format, Logger, transports } from "winston";
const { combine, colorize, simple } = format;

type Task = {
  command: string;
  label: string;
  finishMessage: string;
};
const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
});
async function preValidate() {
  return new Promise((resolve, reject) => {
    const { engines } = require("../package.json");
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
async function runFunction(task: Task, logger: Logger): Promise<string> {
  logger.info(`Starting ${task.label}`);
  return new Promise((resolve, reject) => {
    exec(task.command, (error, stdout, stderr) => {
      error && reject(error);
      if (stdout) {
        logger.info(`Finish ${task.finishMessage}`);
        stdout && resolve(task.label);
      }
    });
  });
}
const bootstrap: Task[] = [
  {
    command: "npm run bootstrap",
    finishMessage: "npm run bootstrap",
    label: "Bootstrap",
  },
];
const clientStep: Task[] = [
  {
    command:
      "npm run build -- --scope @amplication/client --include-dependencies",
    finishMessage: "the build of all the client dependencies",
    label: "Client build",
  },
];
const serverBuild: Task[] = [
  {
    command: "npm run prisma:generate",
    finishMessage: "prisma generation in the sever",
    label: "prisma generation",
  },
  {
    command:
      "npm run build -- --scope @amplication/server --include-dependencies",
    finishMessage: "the build of all the server dependencies",
    label: "server build",
  },
];
const graphqlGeneration: Task[] = [
  {
    command: "npm run generate",
    finishMessage: "all of the graphql schemas generation",
    label: "graphql generation",
  },
];
const docker: Task[] = [
  {
    command: "cd packages/amplication-server && npm run docker",
    finishMessage: "the docker compose",
    label: "docker compose startup",
  },
];

const dockerInit: Task[] = [
  {
    command: "cd packages/amplication-server && npm run start:db",
    finishMessage: "the seeding of the db",
    label: "db seeding",
  },
];
const tasks: Task[][] = [
  bootstrap,
  clientStep,
  serverBuild,
  graphqlGeneration,
  docker,
  dockerInit,
];
if (require.main === module) {
  (async () => {
    logger.info(`Starting the script!`);
    await preValidate();
    for (let i = 0; i < tasks.length; i++) {
      const step = tasks[i];
      logger.info(`Starting step ${i + 1}`);
      const tasksPromises = step.map((task) => {
        return runFunction(task, logger);
      });
      await Promise.all(tasksPromises);
    }
    logger.info("Finish all the process for the setup, have fun hacking 🎉");
  })();
}
