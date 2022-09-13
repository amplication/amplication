import YAML from "yaml";
import { Module } from "@amplication/code-gen-types";
import path from "path";
import { promises as fs } from "fs";

export async function createDockerComposeFile(
  baseDirectory: string,
  fileName: string,
  updateProperties: { [key: string]: any } = {}
): Promise<Module> {
  const filePath = path.resolve(__dirname, "docker-compose", fileName);
  const content = await fs.readFile(filePath, "utf-8");
  const parsed = YAML.parse(content);
  const updated = Object.assign(parsed, updateProperties);
  const fileNameWithoutTemplate = fileName.replace(".template", "");

  return {
    path: path.join(baseDirectory, fileNameWithoutTemplate),
    code: YAML.stringify(updated, { nullStr: "~" }),
  };
}
