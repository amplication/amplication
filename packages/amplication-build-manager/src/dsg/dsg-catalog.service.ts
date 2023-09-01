import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGenerationVersionStrategy } from "@amplication/schema-registry";
import axios from "axios";

@Traceable()
@Injectable()
export class DsgCatalogService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  private sortVersions(versions: string[]): string[] {
    return versions.sort((version1: string, version2: string): number => {
      const parseVersion = (version: string): number[] => {
        const versionParts = version.replace("v", "").split(".");
        return versionParts.map((part) => parseInt(part, 10));
      };

      const parsedVersion1 = parseVersion(version1);
      const parsedVersion2 = parseVersion(version2);

      for (
        let i = 0;
        i < Math.max(parsedVersion1.length, parsedVersion2.length);
        i++
      ) {
        const part1 = parsedVersion1[i] || 0;
        const part2 = parsedVersion2[i] || 0;

        if (part1 < part2) {
          return 1; // version2 is greater
        } else if (part1 > part2) {
          return -1; // version1 is greater
        }
      }

      return 0; // versions are equal
    });
  }

  private async getDsgAvailableVersions(): Promise<string[]> {
    const catalogServiceUrl = this.configService.get(
      Env.DSG_CATALOG_SERVICE_URL
    );
    const response = await axios.get<string[]>(
      `${catalogServiceUrl}/versions`,
      {
        params: {},
      }
    );

    return response.data;
  }

  private async getLatestVersion(
    versions: string[],
    specificVersion?: string
  ): Promise<string> {
    const sortedVersions = this.sortVersions(versions);
    if (!specificVersion) {
      // return the most recent version
      return sortedVersions[0];
    }
    const specificVersionParts = specificVersion.replace("v", "").split(".");
    const specificVersionMajor = specificVersionParts[0];

    const latestMinorVersion = sortedVersions.find((version) => {
      const versionParts = version.replace("v", "").split(".");
      return versionParts[0] === specificVersionMajor;
    });
    if (!latestMinorVersion) {
      throw new Error(
        `Could not find latest minor version for ${specificVersion}`
      );
    }
    return latestMinorVersion;
  }

  async getDsgVersion({
    dsgVersion,
    dsgVersionOption,
  }: {
    dsgVersion?: string;
    dsgVersionOption?: CodeGenerationVersionStrategy;
  }): Promise<string | undefined> {
    if (!dsgVersion) {
      return;
    }

    const versions =
      dsgVersionOption !== CodeGenerationVersionStrategy.SPECIFIC
        ? await this.getDsgAvailableVersions()
        : [];

    switch (dsgVersionOption) {
      case CodeGenerationVersionStrategy.SPECIFIC:
        return dsgVersion;
      case CodeGenerationVersionStrategy.LATEST_MINOR:
        return this.getLatestVersion(versions, dsgVersion);
      case CodeGenerationVersionStrategy.LATEST_MAJOR:
      default:
        return this.getLatestVersion(versions);
    }
  }
}
