import { Module } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { print } from "recast";
import { parse, removeTSIgnoreComments } from "../../../util/ast";

const templatePath = resolve(__dirname, "kafka.module.template.ts");

export async function createKafkaModule(kafkaFolder: string): Promise<Module> {
  const template = await readFile(templatePath, "utf8");
  const generateFileName = "kafka.module.ts";
  const astFile = parse(template);

  removeTSIgnoreComments(astFile);

  const code = print(astFile).code;
  return {
    code: code,
    path: join(kafkaFolder, generateFileName),
  };
}
