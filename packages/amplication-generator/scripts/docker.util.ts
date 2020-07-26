import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";

const TMP_DIR = os.tmpdir();

export function run(image: string, options: { cwd: string }): Promise<string> {
  const cidFile = path.join(TMP_DIR, `${Math.random().toString(32)}.cid`);
  return new Promise((resolve, reject) => {
    console.info("Running Docker container...");
    const dockerRun = spawn(
      "docker",
      ["run", `--cidfile=${cidFile}`, image],
      options
    );
    dockerRun.stdout.on("data", (data) => {
      const dataString = data.toString();
      console.log(`Docker run stdout | ${dataString}`);
      if (dataString.match(/Nest application successfully started/)) {
        const cid = fs.readFileSync(cidFile, "utf-8");
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
