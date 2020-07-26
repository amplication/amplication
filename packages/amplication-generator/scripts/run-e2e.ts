import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";
import { Docker } from "docker-cli-js";
import { generateExample } from "../example/src/generate";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;
const TMP_DIR = os.tmpdir();
const CID_FILE = path.join(TMP_DIR, `${Math.random().toString(32)}.cid`);
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
  const container = await run(imageId);

  console.info("Killing Docker container...");
  await docker.command(`kill ${container}`);

  console.info("Removing Docker container...");
  await docker.command(`rm ${container}`);

  if (!NO_DELETE_IMAGE) {
    // Remove the built Docker image
    await docker.command(`image rm ${imageId}`);
  }
}

function run(image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.info("Running Docker container...");
    const dockerRun = spawn("docker", ["run", `--cidfile=${CID_FILE}`, image], {
      cwd: EXAMPLE_DIST,
    });
    dockerRun.stdout.on("data", (data) => {
      const dataString = data.toString();
      console.log(`Docker run stdout | ${dataString}`);
      if (dataString.match(/Nest application successfully started/)) {
        const cid = fs.readFileSync(CID_FILE, "utf-8");
        resolve(cid);
      }
    });

    dockerRun.stderr.on("data", (data) => {
      console.error(`Docker run stderr | ${data}`);
    });

    dockerRun.on("close", (code) => {
      reject(code);
    });
  });
}
