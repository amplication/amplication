import { config } from 'dotenv';
import assert from 'assert';
config();

export class EnvironmentVariables {
  static get(key: string, strict: boolean): string | undefined {
    const envValue: string | undefined = process.env[key];
    if (strict) {
      assert(envValue, `Missing ${key} in the env`);
    }
    return envValue;
  }
  static getArray(key: string, strict: boolean, separator: string): string[] {
    const envValue = EnvironmentVariables.get(key, strict);
    if (!envValue) {
      throw new Error(`Missing ${key} in the env`);
    }
    const array = envValue.split(separator);
    return array;
  }
}
