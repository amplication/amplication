import * as os from "os";
import * as path from "path";
import * as compose from "docker-compose";
import getPort from "get-port";
import sleep from "sleep-promise";
import generateTestDataService from "./generate-test-data-service";
import testAPI from "./test-api";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const SERVER_START_TIMEOUT = 30000;

runE2E()
  .then(() => {
    console.info("Done successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function runE2E() {
  const directory = path.join(os.tmpdir(), "test-data-service");
  // Generate the test data service
  await generateTestDataService(directory);

  // Run with Docker
  console.info("Getting Docker Compose up...");
  const port = await getPort();
  const dbPort = await getPort();
  const user = "admin";
  const password = "admin";

  process.env["POSTGRESQL_USER"] = user;
  process.env["POSTGRESQL_PASSWORD"] = password;
  process.env["POSTGRESQL_PORT"] = String(dbPort);
  process.env["SERVER_PORT"] = String(port);

  const options = {
    cwd: directory,
    log: true,
    composeOptions: ["--project-name=e2e"],
  };

  // Always uses the -d flag due to non interactive mode
  await compose.upAll({
    ...options,
    commandOptions: ["--build", "--force-recreate"],
  });

  compose.logs([], { ...options, follow: true });

  console.info("Waiting for server to be ready...");
  await sleep(SERVER_START_TIMEOUT);

  console.info("Seeding database...");
  await compose.exec("server", "node scripts/seed.js", options);

  await testAPI(port);

  console.info("Getting Docker Compose down...");
  await compose.down({
    ...options,
    commandOptions: NO_DELETE_IMAGE
      ? ["--volumes"]
      : ["--rmi=local", "--volumes"],
  });
}
