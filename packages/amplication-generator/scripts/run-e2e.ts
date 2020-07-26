import * as path from "path";
import { Docker } from "docker-cli-js";
import getPort from "get-port";
import fetch, { Response } from "node-fetch";
import sleep from "sleep-promise";
import { spawn } from "child_process";
import { generateExample } from "../example/src/generate";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const EXAMPLE_DIST = path.join(__dirname, "..", "example", "dist");
const SERVER_START_TIMEOUT = 30000;

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
  console.info("Running Docker container...");
  const port = await getPort();
  const { containerId } = await docker.command(
    `run -p ${port}:3000 -d ${imageId}`
  );

  streamLogs(containerId);

  // Wait for the container to be ready
  console.log("Waiting for server to be ready...");
  await sleep(SERVER_START_TIMEOUT);

  let res: Response;
  console.log("POST /customers");
  res = await fetch(`http://0.0.0.0:${port}/customers`, {
    method: "POST",
    body: JSON.stringify({
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Appleseed",
    }),
  });
  console.log(await res.json());

  console.log("GET /customers");
  res = await fetch(`http://0.0.0.0:${port}/customers`);
  const customers = await res.json();
  console.log(customers);
  const id = customers[0].id;

  console.log(`GET /customer/${id}`);
  res = await fetch(`http://0.0.0.0:${port}/customer/${id}`);
  console.log(await res.json());

  console.info("Killing Docker container...");
  await docker.command(`kill ${containerId}`);

  console.info("Removing Docker container...");
  await docker.command(`rm ${containerId}`);

  if (!NO_DELETE_IMAGE) {
    // Remove the built Docker image
    await docker.command(`image rm ${imageId}`);
  }
}

function streamLogs(containerID: string) {
  const logs = spawn("docker", ["logs", "--follow", containerID], {
    stdio: "inherit",
  });
  logs.on("close", (code) => {
    throw new Error(`Closed with ${code}`);
  });
}
