import { config } from "dotenv";
import assert from "assert";

config();

export class EnvironmentVariables {
  static get(key: string, strict: true): string;
  static get(key: string, strict: boolean): string | undefined;
  static get(key: string, strict: boolean): string | undefined {
    const envValue: string | undefined = process.env[key];
    if (strict) {
      assert(envValue, `Missing ${key} in the env`);
    }
    return envValue;
  }

  static getJson(key: string, strict: true): string[];
  static getJson(key: string, strict: boolean): string[] | undefined;
  static getJson(key: string, strict: boolean): string[] | undefined {
    const envValue = EnvironmentVariables.get(key, strict);
    const jsonObject = JSON.parse(envValue || "");
    return jsonObject;
  }
}
