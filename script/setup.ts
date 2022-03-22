import { exec } from "child_process";
import { satisfies } from "semver";
import { createLogger, format, Logger, transports } from "winston";
const { combine, colorize, simple } = format;

class Task {
  constructor(public command: string, public label: string) {}
}
const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
});
function preValidate() {
  const { engines } = require("../package.json");
  const { node: nodeRange, npm } = engines;
  const npm_config_user_agent = process.env.npm_config_user_agent;
  const currentNpmVersionArray = npm_config_user_agent?.match(
    /npm\/[\^*\~*]*[\d\.]+/
  );
  const currentNpmVersion = currentNpmVersionArray[0]?.slice(4);
  if (!currentNpmVersionArray || !currentNpmVersion) {
    logger.error(
      "Mmmmm... it seems like you don't have permission to run the script. Try to run it as an administrator."
    );
    process.exit(1);
  }
  const currentNode = process.versions.node;
  if (!satisfies(currentNode, nodeRange)) {
    logger.error(
      `This system seems to use an incompatible Node.js version, current version: ${currentNode} required version: ${nodeRange}`
    );
    process.exit(1);
  }
  if (!satisfies(currentNpmVersion, npm)) {
    logger.error(
      `This system seems to use an incompatible NPM version, current version: ${currentNpmVersion} required version: ${npm}`
    );
    process.exit(1);
  }
}
async function runFunction(task: Task, logger: Logger): Promise<string> {
  logger.info(`Starting ${task.label}`);
  return new Promise((resolve, reject) => {
    exec(task.command, (error, stdout, stderr) => {
      error && reject(error);
      if (stdout) {
        logger.info(`Finish ${task.label}`);
        stdout && resolve(task.label);
      }
    });
  });
}
const bootstrap: Task[] = [
  {
    command: "npm run bootstrap",
    label: "Bootstrap",
  },
];
const clientStep: Task[] = [
  {
    command:
      "npm run build -- --scope @amplication/client --include-dependencies",
    label: "Client build",
  },
];
const serverBuild: Task[] = [
  {
    command: "npm run prisma:generate",
    label: "prisma generation",
  },
  {
    command:
      "npm run build -- --scope @amplication/server --include-dependencies",
    label: "server build",
  },
];
const graphqlGeneration: Task[] = [
  {
    command: "npm run generate",
    label: "generation graphql schema",
  },
];
const docker: Task[] = [
  {
    command: "cd packages/amplication-server && npm run docker",
    label: "running docker compose up",
  },
];

const dockerInit: Task[] = [
  {
    command: "cd packages/amplication-server && npm run start:db",
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
    preValidate();
    logger.info(`Welcome to Amplication installer!`);
    logger.info(
      "This script will help you easily set up a running amplication server"
    );
    console.log("");

    for (let i = 0; i < tasks.length; i++) {
      const step = tasks[i];

      logger.info(`Starting step ${i + 1}/${tasks.length}`);
      const tasksPromises = step.map((task) => {
        return runFunction(task, logger);
      });
      await Promise.all(tasksPromises);
      console.log("");
    }
    logger.info("Finish all the process for the setup, have fun hacking");
  })();
}
