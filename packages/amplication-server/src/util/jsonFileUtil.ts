import { JsonObject } from 'type-fest';
import { readFile, writeFile } from 'fs';

export class JsonFileUtil {
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

  static write: (path: string, packageJson: JsonObject) => Promise<boolean> = (
    path: string,
    packageJson: JsonObject
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      const data = new Uint8Array(
        Buffer.from(JSON.stringify(packageJson, null, '\t'))
      );
      writeFile(path, data, err => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  };
}
