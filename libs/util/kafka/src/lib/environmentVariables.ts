import { config } from "dotenv";
import assert from "assert";

export class EnvironmentVariables {
  private static _instance: EnvironmentVariables = new EnvironmentVariables();

  private constructor() {
    config();
  }

  public static get instance(): EnvironmentVariables {
    return this._instance;
  }

  get(key: string, strict: true): string;
  get(key: string, strict: boolean): string | undefined;
  get(key: string, strict: boolean): string | undefined {
    const envValue: string | undefined = process.env[key];
    if (strict) {
      assert(envValue, `Missing ${key} in the env`);
    }
    return envValue;
  }
}
