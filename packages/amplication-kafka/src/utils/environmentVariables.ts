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
      try{
        assert(envValue, `Missing ${key} in the env`);
      } catch (_){
        console.error( `Missing ${key} in the env, exit service`)
        process.exit(1)
      }
    }
    return envValue;
  }

  getJson(key: string, strict: true): string[];
  getJson(key: string, strict: boolean): string[] | undefined;
  getJson(key: string, strict: boolean): string[] | undefined {
    const envValue = this.get(key, strict);
    const jsonObject = JSON.parse(envValue || "");
    return jsonObject;
  }
}
