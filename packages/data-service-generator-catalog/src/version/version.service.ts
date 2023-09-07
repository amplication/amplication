import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VersionServiceBase } from "./base/version.service.base";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { Version } from "./base/Version";
import { GetCodeGeneratorVersionInput } from "./GetCodeGeneratorVersionInput";

@Injectable()
export class VersionService extends VersionServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

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

  async getCodeGeneratorVersion(
    args: GetCodeGeneratorVersionInput
  ): Promise<Version | undefined> {
    const { codeGeneratorVersion, codeGeneratorStrategy } = args;
    if (
      (!codeGeneratorVersion &&
        (codeGeneratorStrategy === CodeGeneratorVersionStrategy.Specific ||
          codeGeneratorStrategy ===
            CodeGeneratorVersionStrategy.LatestMinor)) ||
      !codeGeneratorStrategy
    ) {
      throw new BadRequestException();
    }

    if (codeGeneratorStrategy === CodeGeneratorVersionStrategy.Specific) {
      return (
        await this.findMany({
          where: {
            name: codeGeneratorVersion,
          },
          take: 1,
        })
      )[0];
    }

    const activeVersions = await this.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    });

    let selectedVersion: string;

    switch (codeGeneratorStrategy) {
      case CodeGeneratorVersionStrategy.LatestMinor:
        selectedVersion = await this.getLatestVersion(
          activeVersions.map((version) => version.name),
          codeGeneratorVersion
        );
        break;
      case CodeGeneratorVersionStrategy.LatestMajor:
      default:
        selectedVersion = await this.getLatestVersion(
          activeVersions.map((version) => version.name)
        );
        break;
    }

    return activeVersions.find((version) => version.name === selectedVersion);
  }
}
