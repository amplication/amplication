import { Module } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { print } from "recast";
import { parse, removeTSIgnoreComments } from "../../../util/ast";

export async function createKafkaServiceModules(
  kafkaFolder: string
): Promise<Module[]> {
  const serviceModule = await createKafkaServiceModule(kafkaFolder, false);
  const baseServiceModule = await createKafkaServiceModule(kafkaFolder, true);
  return [serviceModule, baseServiceModule];
}

async function createKafkaServiceModule(
  kafkaFolder: string,
  baseService: boolean
): Promise<Module> {
  const templatePath = resolve(
    __dirname,
    `kafka.service${baseService ? ".base" : ""}.template.ts`
  );

  const template = await readFile(templatePath, "utf8");
  const generateFileName = `kafka.service${baseService ? ".base" : ""}.ts`;
  const astFile = parse(template);

  removeTSIgnoreComments(astFile);

  const code = print(astFile).code;
  const path = join(kafkaFolder, baseService ? "base" : "", generateFileName);
  return { code, path };
}
