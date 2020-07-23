import * as path from "path";
import { spawn, spawnSync } from "child_process";
import { generateExample } from "../example/src/generate";

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

  // Run with Docker
  await run(image);
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

function run(image: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.info("Running Docker container...");
    const dockerRun = spawn("docker", ["run", image], {
      cwd: EXAMPLE_DIST,
    });
    dockerRun.stdout.on("data", (data) => {
      const dataString = data.toString();
      console.log(`Docker run stdout | ${dataString}`);
      if (dataString.match(/Nest application successfully started/)) {
        resolve();
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
