import path from "path";
import { Module, ModuleMap } from "@amplication/code-gen-types";
import { readCode } from "@amplication/code-gen-utils";
import manifest from "./manifest.json";
import DsgContext from "../../dsg-context";

const indexHTMLPath = path.join(__dirname, "index.template.html");

export async function createPublicFiles(): Promise<ModuleMap> {
  const publicFilesModules = new ModuleMap(DsgContext.getInstance.logger);
  const manifestModule = createManifestModule();
  const indexHTMLModule = await createIndexHTMLModule();
  publicFilesModules.set(manifestModule);
  publicFilesModules.set(indexHTMLModule);
  return publicFilesModules;
}

const createIndexHTMLModule = async (): Promise<Module> => {
  const html = await readCode(indexHTMLPath);
  const { appInfo, clientDirectories } = DsgContext.getInstance;
  return {
    path: `${clientDirectories.publicDirectory}/index.html`,
    code: html
      .replace("{{description}}", appInfo.description)
      .replace("{{title}}", appInfo.name),
  };
};

const createManifestModule = (): Module => {
  const { appInfo, clientDirectories } = DsgContext.getInstance;
  return {
    path: `${clientDirectories.publicDirectory}/manifest.json`,
    code: JSON.stringify(
      {
        ...manifest,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        short_name: appInfo.name,
        name: appInfo.name,
      },
      null,
      2
    ),
  };
};
