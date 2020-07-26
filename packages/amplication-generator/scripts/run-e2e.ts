import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn, spawnSync } from "child_process";
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

  // Build with Docker
  const image = build();

  try {
    // Run with Docker
    const container = await run(image);
    // Kill the Docker container
    killContainer(container);
    // Remove the Docker container
    removeContainer(container);
  } finally {
    if (!NO_DELETE_IMAGE) {
      // Remove the built Docker image
      removeImage(image);
    }
  }
}

function build(): string {
  console.info("Building Docker image...");
  const { stdout, stderr, error } = spawnSync("docker", ["build", "."], {
    cwd: EXAMPLE_DIST,
  });

  if (error) {
    console.error(error);
    throw new Error();
  }

  if (stderr.toString()) {
    console.error(stderr.toString());
    throw new Error();
  }

  const output = stdout.toString();
  const match = output.match(/Successfully built (.+)/);
  const [line, image] = match;

  console.info(line);

  return image;
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

function removeImage(image: string): void {
  console.log("Removing Docker image...");
  const { stderr, error } = spawnSync("docker", ["image", "rm", image], {
    cwd: EXAMPLE_DIST,
  });

  if (error) {
    console.error(error);
    throw new Error();
  }

  if (stderr.toString()) {
    console.error(stderr.toString());
    throw new Error();
  }
}

function killContainer(container: string): void {
  console.log("Killing Docker container...");
  const { stdout, stderr, error } = spawnSync("docker", ["kill", container], {
    cwd: EXAMPLE_DIST,
  });

  if (error) {
    console.error(error);
    throw new Error();
  }

  if (stderr.toString()) {
    console.error(stderr.toString());
    throw new Error();
  }

  if (stdout.toString()) {
    console.log(stdout.toString());
  }
}

function removeContainer(container: string): void {
  console.log("Removing Docker container...");
  const { stdout, stderr, error } = spawnSync("docker", ["rm", container], {
    cwd: EXAMPLE_DIST,
  });

  if (error) {
    console.error(error);
    throw new Error();
  }

  if (stderr.toString()) {
    console.error(stderr.toString());
    throw new Error();
  }

  if (stdout.toString()) {
    console.log(stdout.toString());
  }
}
