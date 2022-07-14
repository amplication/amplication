import path from "path";
import { AppInfo, Module } from "@amplication/code-gen-types";
import { readCode } from "../../util/module";
import manifest from "./manifest.json";

const indexHTMLPath = path.join(__dirname, "index.template.html");

export async function createPublicFiles(
  appInfo: AppInfo,
  publicPath: string
): Promise<Module[]> {
  return [
    createManifestModule(appInfo, publicPath),
    await createIndexHTMLModule(appInfo, publicPath),
  ];
}

export async function createIndexHTMLModule(
  appInfo: AppInfo,
  publicPath: string
): Promise<Module> {
  const html = await readCode(indexHTMLPath);
  return {
    path: `${publicPath}/index.html`,
    code: html
      .replace("{{description}}", appInfo.description)
      .replace("{{title}}", appInfo.name),
  };
}

export function createManifestModule(
  appInfo: AppInfo,
  publicPath: string
): Module {
  return {
    path: `${publicPath}/manifest.json`,
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
}
