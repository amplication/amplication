import { config } from "dotenv";
import assert from "assert";

config();

export class EnvironmentVariables {
  static get(key: string): string | undefined {
    const envValue: string | undefined = process.env[key];
    return envValue;
  }
  static getStrict(key: string): string {
    const envValue = EnvironmentVariables.get(key);
    assert(envValue, `Missing ${key} in the env`);
    return envValue;
  }
}
