import { exec } from "child_process";
import { satisfies } from "semver";
import { createLogger, format, transports } from "winston";
import ora from "ora";

const { combine, colorize, simple } = format;

const isDebugMode = process.env.DEBUG === "true";

const spinner = ora();
spinner.color = "green";

const logo = `  
            ...   :..              
        .~?Y5P!  .PP5Y7^.          
      ~YPPPPPP!  .5PPPPP5?:        
    :YPPPPPPPP!  .5PPPPPPPP?.      
   ~PPPPPPPPPP!  .5PPPPPPPPPY.     
  :PPPPPPPPPPP!  .5PPPPPPPPPPJ     
  ?PPPPPPPPPPP!  .5PPPPPPPPPPP:    
  JPPPPPPPPPPP!  .5PPPPPPPPPPP^    
  !PPPPPPPPPPP!  .5PPPPPPPPPPP:    
  .YPPPPPPPPPP!  .5PPPPPPPPPPP:    
   .YPPPPPPPPP!  .5PPPPPPPPPPP:    
     !5PPPPPPP!  .5PPPPPPPPPPP:    
      .~YPPPPP!  .PPPPPPPPPPPP:    
         .^!?Y~  .YYYYYYYYYYY5:    
 `;

interface Task {
  command: string;
  label: string;
}

const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
});

function preValidate() {
  const { engines } = require("../package.json");
  const { node: nodeRange, npm } = engines;
  const npm_config_user_agent = process.env.npm_config_user_agent;
  const currentNpmVersionArray: any = npm_config_user_agent?.match(
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

async function runFunction(task: Task): Promise<string> {
  spinner.start(`${task.label}` + "\n");
  return new Promise((resolve, reject) => {
    const proc = exec(task.command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stdout) {
        spinner.succeed(`Finished ${task.label}`);
        stdout && resolve(task.label);
      }
    });

    if (isDebugMode) {
      proc.stdout?.on("data", (data) => {
        logger.info(data);
      });
    }
  });
}

const clean: Task[] = [
  {
    command: "npx nx clear-cache",
    label: "clearing Nx cache 🧼",
  },
];
const install: Task[] = [
  {
    command: "npm install",
    label: "installing dependencies 🚀",
  },
];
const preparePrisma: Task[] = [
  {
    command:
      "npx nx run-many --target db:prisma:generate --output-style stream",
    label: "generating Prisma client 🧬",
  },
];
const prepareGraphQL: Task[] = [
  {
    command:
      "npx nx run-many --target graphql:schema:generate --output-style stream",
    label: "generating graphql schema 🧬",
  },
  {
    command: "npm run graphql-codegen",
    label: "running graphql codegen 🧬",
  },
];
const build: Task[] = [
  {
    command: "npx nx run-many --target build --output-style stream",
    label: "building packages 📦",
  },
];
const dockerCompose: Task[] = [
  {
    command: "npm run docker:dev",
    label: "docker compose 🐳",
  },
];
const prismaMigration: Task[] = [
  {
    command: "npm run migrate:up",
    label: "prisma migration 🏗 ",
  },
];

const tasks: Task[][] = [
  clean,
  install,
  preparePrisma,
  prepareGraphQL,
  build,
  // dockerCompose,
];

if (require.main === module) {
  (async () => {
    try {
      preValidate();
      logger.info(`Welcome to Amplication installer!`);
      console.log(logo);
      console.log("");

      for (let i = 0; i < tasks.length; i++) {
        const step = tasks[i];

        logger.info(`Starting step ${i + 1}/${tasks.length}`);
        const tasksPromises = step.map((task) => {
          return runFunction(task);
        });
        await Promise.all(tasksPromises);
        console.log("");
      }
      logger.info("Setup complete. Have fun! 👾");
      logger.info(
        "✋ To run a specific service, go to its README file and follow the instructions❗️"
      );
      logger.info("Link to our docs: 'https://docs.amplication.com/docs/' 📜");
    } catch (error) {
      spinner.fail();
      console.error((error as Error).message);
    }
  })();
}
