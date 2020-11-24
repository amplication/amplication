import Ajv from "ajv";
import rc from "rc";
import cronstrue from "cronstrue";
import configSchema from "./config.schema.json";
import { Config } from "./config";

const APP_NAME = "scheduler";

export async function getConfig(): Promise<Config> {
  const { config, configs, _, ...rest } = rc(APP_NAME);
  if (config) {
    console.info(`Loaded configuration from: ${config}`);
  }
  const validConfig = await validateConfig(rest);
  console.info(summarizeConfig(validConfig));
  return validConfig;
}

function summarizeConfig(config: Config) {
  const { method = "GET", url } = config.request;
  const cron = cronstrue.toString(config.schedule);
  return `Will make a ${method} call to ${url} ${cron
    .slice(0, 1)
    .toLowerCase()}${cron.slice(1)}`;
}

async function validateConfig(config: any): Promise<Config> {
  const ajv = new Ajv();
  const validate = ajv.compile(configSchema);
  const valid = validate(config);
  if (!valid) {
    console.error("Config validation errors", validate.errors);
    throw new Error("Invalid config, see errors");
  }
  return config;
}
