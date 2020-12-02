import { AppInfo } from "../../types";
import { Module } from "../../util/module";
import manifest from "./manifest.json";

export function createPublicFiles(appInfo: AppInfo): Module[] {
  return [createManifestModule(appInfo)];
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
