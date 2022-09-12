import { Module } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";

const templatePath = resolve(
  __dirname,
  "generateKafkaClientOptions.template.ts"
);

export async function createGenerateKafkaClientOptionsFunction(
  kafkaFolder: string
): Promise<Module> {
  const template = await readFile(templatePath, "utf8");
  const generateFileName = "generateKafkaClientOptions.ts";
  return {
    code: template,
    path: join(kafkaFolder, generateFileName),
  };
}
