import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";

@Injectable()
export class UtilsService {
  /**
   * This function extracts the buildId from the buildId with suffix.
   * It's needed because the buildId is used as a key in the Kafka messages and and as a folder name in the artifacts and when it
   * interacts with the data-service-generator and the server it needs to be without the suffix.
   * @param buildIdWithSuffix the buildId with suffix which in this case could be "-server" or "-admin-ui"
   * @returns return the substring before the first hyphen or the whole string if there is no hyphen
   */
  extractBuildId(buildIdWithSuffix: string): string {
    const hyphenIndex = buildIdWithSuffix.indexOf("-");
    return hyphenIndex !== -1
      ? buildIdWithSuffix.substring(0, hyphenIndex)
      : buildIdWithSuffix;
  }

  async isPathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
