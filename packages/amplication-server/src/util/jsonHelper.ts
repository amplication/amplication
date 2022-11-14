import type { JsonObject, JsonValue } from "type-fest";
import { readFile, writeFile } from "fs";

export class JsonHelper {
  private static instance: JsonHelper;

  public static getInstance(path: string): JsonHelper {
    if (!JsonHelper.instance) {
      JsonHelper.instance = new JsonHelper(path);
    }

    return JsonHelper.instance;
  }

  private packageJson: Promise<JsonObject>;

  private constructor(private path: string) {
    this.packageJson = JsonHelper.read(path).catch((reason) => {
      return null;
    });
  }

  async exists(): Promise<boolean> {
    return (await this.packageJson) !== null;
  }

  async getValue(name: string): Promise<JsonValue> {
    const packageJson = await this.packageJson;
    if (packageJson) {
      return packageJson[name];
    } else {
      return null;
    }
  }

  async getStringValue(name: string): Promise<string> {
    return JSON.stringify(await this.getValue(name));
  }

  async updateValue(name: string, value: JsonValue): Promise<boolean> {
    let packageJson = await this.packageJson;
    if (packageJson) {
      packageJson[name] = value;
    } else {
      packageJson = {};
      packageJson[name] = value;
    }
    this.packageJson = Promise.resolve(packageJson);
    return await JsonHelper.write(this.path, packageJson);
  }

  static read: (path: string) => Promise<JsonObject> = (
    path: string
  ): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  };

  static write: (
    path: string,
    packageJson: JsonObject,
    space?: string | number
  ) => Promise<boolean> = (
    path: string,
    packageJson: JsonObject,
    space: string | number = 2
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      const data = new Uint8Array(
        Buffer.from(JSON.stringify(packageJson, null, space))
      );
      writeFile(path, data, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  };
}
