import { promises as fs } from "fs";
import { exec } from "child_process";

const buildSpecPath = process.env.BUILD_SPEC_PATH;
const installationPath = process.env.INSTALLATION_PATH;

if (!buildSpecPath) {
  throw new Error("BUILD_SPEC_PATH is not defined");
}

if (!installationPath) {
  throw new Error("INSTALLATION_PATH is not defined");
}

interface Plugin {
  npm: string;
  version: string;
}

async function loadPlugins(): Promise<void> {
  const spec = await loadSpec();
  const { data } = spec;
  const { pluginInstallations } = data;

  console.log(`Found ${pluginInstallations.length} plugins to install`);
  await installPlugins(pluginInstallations);
}

loadPlugins(); // eslint-disable-line @typescript-eslint/no-floating-promises

async function installPlugins(plugins: Plugin[]) {
  await fs.mkdir(installationPath as string, { recursive: true });

  const pluginList = plugins
    .map(({ npm, version }) => `${npm}@${version}`)
    .join(" ");

  const cmd = `npm install ${pluginList}`;
  console.log("Installing plugins", { cmd });

  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: installationPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      }

      console.log(stdout);
      resolve(true);
    });
  });
}

async function loadSpec() {
  const spec = await fs.readFile(buildSpecPath as string, "utf-8");
  return JSON.parse(spec);
}
