import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import axios from "axios";

@Traceable()
@Injectable()
export class CodeGeneratorService {
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

  private async getCodeGeneratorAvailableVersions(): Promise<string[]> {
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

  async getCodeGeneratorVersion({
    codeGeneratorVersion,
    codeGeneratorVersionOption,
  }: {
    codeGeneratorVersion?: string;
    codeGeneratorVersionOption?: CodeGeneratorVersionStrategy;
  }): Promise<string | undefined> {
    if (!codeGeneratorVersion) {
      return;
    }

    const versions =
      codeGeneratorVersionOption !== CodeGeneratorVersionStrategy.Specific
        ? await this.getCodeGeneratorAvailableVersions()
        : [];

    switch (codeGeneratorVersionOption) {
      case CodeGeneratorVersionStrategy.Specific:
        return codeGeneratorVersion;
      case CodeGeneratorVersionStrategy.LatestMinor:
        return this.getLatestVersion(versions, codeGeneratorVersion);
      case CodeGeneratorVersionStrategy.LatestMajor:
      default:
        return this.getLatestVersion(versions);
    }
  }
}
