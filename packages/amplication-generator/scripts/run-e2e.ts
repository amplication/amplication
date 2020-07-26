import * as path from "path";

import { Docker } from "docker-cli-js";
import { generateExample } from "../example/src/generate";
import { run } from "./docker.util";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const EXAMPLE_DIST = path.join(__dirname, "..", "example", "dist");

runE2E()
  .then(() => {
    console.log("Done successfully");
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
  const container = await run(imageId, {
    cwd: EXAMPLE_DIST,
  });

  console.info("Killing Docker container...");
  await docker.command(`kill ${container}`);

  console.info("Removing Docker container...");
  await docker.command(`rm ${container}`);

  if (!NO_DELETE_IMAGE) {
    // Remove the built Docker image
    await docker.command(`image rm ${imageId}`);
  }
}
