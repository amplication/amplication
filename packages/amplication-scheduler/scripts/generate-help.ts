import fs from "fs";
import path from "path";

import configSchema from "../src/config.schema.json";

if (require.main === module) {
  fs.promises
    .writeFile(
      path.join(__dirname, "..", "src", "help.json"),
      JSON.stringify(createText())
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

function createText(): string {
  const synopsis = Object.entries(configSchema.properties)
    .flatMap(([key, value]) => {
      if (value.type === "object") {
        return Object.entries(
          // @ts-ignore
          value.properties
        ).map(([property, propertyValue]) => {
          // @ts-ignore
          const option = `--${key}.${property}`;
          // @ts-ignore
          return value.required.includes(property) ? option : `[${option}]`;
        });
      }
      const option = `--${key}`;
      return configSchema.required.includes(key) ? option : `[${option}]`;
    })
    .concat("[-h|--help]")
    .join(" ");
  const options = Object.entries(configSchema.properties)
    .flatMap(([key, value]) => {
      if (value.type === "object") {
        return Object.entries(
          // @ts-ignore
          value.properties
        ).map(([property, propertyValue]) => {
          if (
            // @ts-ignore
            propertyValue.type === "object" &&
            // @ts-ignore
            propertyValue.additionalProperties
          ) {
            // @ts-ignore
            return `\t--${key}.${property}.<KEY>=<VALUE>\n\t\t${propertyValue.description}`;
          }
          // @ts-ignore
          if (propertyValue.type === "string" && propertyValue.enum) {
            // @ts-ignore
            const members = propertyValue.enum.join("|");
            // @ts-ignore
            return `\t--${key}.${property}=(${members})\n\t\t${propertyValue.description}`;
          }
          // @ts-ignore
          return `\t--${key}.${property}=<${property}>\n\t\t${propertyValue.description}`;
        });
      }
      return `\t--${key}=<${key}>\n\t\t${value.description}`;
    })
    .concat(`\t-h, --help\n\t\tShow this help text`)
    .join("\n");
  return `scheduler

SYNOPSIS
\t scheduler ${synopsis}

OPTIONS
${options}`;
}
