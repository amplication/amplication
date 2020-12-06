import * as fs from "fs";
import normalize from "normalize-path";
import winston from "winston";
import fg from "fast-glob";
import { Module } from "./types";

export async function readStaticModules(
  source: string,
  basePath: string,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Copying static modules...");
  const directory = `${normalize(source)}/`;
  const staticModules = await fg(`${directory}**/*`, {
    absolute: false,
    dot: true,
    ignore: ["**.js", "**.js.map", "**.d.ts"],
  });

  return Promise.all(
    staticModules.map(async (module) => ({
      path: module.replace(directory, basePath ? basePath + "/" : ""),
      code: await fs.promises.readFile(module, "utf-8"),
    }))
  );
}
