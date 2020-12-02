import path from "path";
import { AppInfo } from "../../types";
import { Module, readCode } from "../../util/module";
import manifest from "./manifest.json";

const indexHTMLPath = path.join(__dirname, "index.template.html");

export async function createPublicFiles(appInfo: AppInfo): Promise<Module[]> {
  return [createManifestModule(appInfo), await createIndexHTMLModule(appInfo)];
}

export async function createIndexHTMLModule(appInfo: AppInfo): Promise<Module> {
  const html = await readCode(indexHTMLPath);
  return {
    path: "admin/public/index.html",
    code: html
      .replace("{{description}}", appInfo.description)
      .replace("{{title}}", appInfo.name),
  };
}

export function createManifestModule(appInfo: AppInfo): Module {
  return {
    path: "admin/public/manifest.json",
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
