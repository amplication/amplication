import path from "path";
import { Module } from "@amplication/code-gen-types";
import { readCode } from "@amplication/code-gen-utils";
import manifest from "./manifest.json";
import DsgContext from "../../dsg-context";

const indexHTMLPath = path.join(__dirname, "index.template.html");

export async function createPublicFiles(): Promise<Module[]> {
  return [createManifestModule(), await createIndexHTMLModule()];
}

export async function createIndexHTMLModule(): Promise<Module> {
  const html = await readCode(indexHTMLPath);
  const { appInfo, clientDirectories } = DsgContext.getInstance;
  return {
    path: `${clientDirectories.publicDirectory}/index.html`,
    code: html
      .replace("{{description}}", appInfo.description)
      .replace("{{title}}", appInfo.name),
  };
}

export function createManifestModule(): Module {
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
}
