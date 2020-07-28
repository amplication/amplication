import * as path from "path";
import { Docker } from "docker-cli-js";
import getPort from "get-port";
import sleep from "sleep-promise";
import { generateExample } from "../example/src/generate";
import testAPI from "./test-api";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const EXAMPLE_DIST = path.join(__dirname, "..", "example", "dist");
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
  // Generate the example package server
  await generateExample();

  const docker = new Docker({
    echo: true,
    currentWorkingDirectory: EXAMPLE_DIST,
  });

  // Build with Docker
  const { imageId } = await docker.command("build .");

  // Run with Docker
  console.info("Running Docker container...");
  const port = await getPort();
  const seedScriptPath = path.join(__dirname, "seed.js");

  const { containerId } = await docker.command(
    `run -p ${port}:3000 -v ${seedScriptPath}:/seed.js -d ${imageId}`
  );

  docker.command(`logs --follow ${containerId}`);

  console.info("Seeding database...");
  await docker.command(`exec ${containerId} node /seed.js`);
  console.info("Seeded database");

  console.info("Waiting for server to be ready...");
  await sleep(SERVER_START_TIMEOUT);

  await testAPI(port);

  console.info("Killing Docker container...");
  await docker.command(`kill ${containerId}`);

  console.info("Removing Docker container...");
  await docker.command(`rm ${containerId}`);

  if (!NO_DELETE_IMAGE) {
    // Remove the built Docker image
    await docker.command(`image rm ${imageId}`);
  }
}
