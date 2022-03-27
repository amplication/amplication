import { JsonObject, JsonValue } from 'type-fest';
import { JsonFileUtil } from './jsonFileUtil';

export class PackageJsonHelper {
  private static instance: PackageJsonHelper;

  public static getInstance(path: string): PackageJsonHelper {
    if (!PackageJsonHelper.instance) {
      PackageJsonHelper.instance = new PackageJsonHelper(path);
    }

    return PackageJsonHelper.instance;
  }

  private readonly packageJson: Promise<JsonObject>;

  private constructor(private path: string) {
    this.packageJson = JsonFileUtil.read(path);
  }

  async getValue(name: string): Promise<JsonValue> {
    const packageJson = await this.packageJson;
    return packageJson[name];
  }

  async getStringValue(name: string): Promise<string> {
    return JSON.stringify(await this.getValue(name));
  }

  async updateValue(name: string, value: JsonValue): Promise<boolean> {
    const packageJson = await this.packageJson;
    packageJson[name] = value;
    return await JsonFileUtil.write(this.path, packageJson);
  }
}
