import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VersionServiceBase } from "./base/version.service.base";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { Version } from "./base/Version";
import { GetCodeGeneratorVersionInput } from "./dto/GetCodeGeneratorVersionInput";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "../../prisma/generated-prisma-client";
import { AwsEcrService } from "../aws/aws-ecr.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class VersionService extends VersionServiceBase {
  private readonly includeDevVersion: string;
  private readonly devVersion: Version;

  constructor(
    protected readonly prisma: PrismaService,
    configService: ConfigService,
    private readonly awsEcrService: AwsEcrService,
    protected readonly logger: AmplicationLogger
  ) {
    super(prisma);
    this.includeDevVersion = configService.get<string>("DEV_VERSION_TAG");
    this.devVersion = {
      id: this.includeDevVersion,
      name: this.includeDevVersion,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      changelog: `Latest development version from ${this.includeDevVersion}`,
      deletedAt: null,
      isDeprecated: false,
    };
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

  private getLatestVersion(versions: string[]): string {
    if (this.includeDevVersion) {
      return this.includeDevVersion;
    }
    return this.sortVersions(versions)[0];
  }

  private async getLatestMinorVersion(
    versions: string[],
    specificVersion: string
  ): Promise<string> {
    const sortedVersions = this.sortVersions(versions);
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
      throw new BadRequestException(
        "codeGeneratorVersion is required when codeGeneratorStrategy is 'Specific' or 'LatestMinor'"
      );
    }
    if (codeGeneratorVersion === this.includeDevVersion) {
      return this.devVersion;
    }

    if (codeGeneratorStrategy === CodeGeneratorVersionStrategy.Specific) {
      const foundVersion = await this.findOne({
        where: {
          id: codeGeneratorVersion,
        },
      });
      if (foundVersion?.name !== codeGeneratorVersion) {
        throw new BadRequestException(
          `Version ${codeGeneratorVersion} not found`
        );
      }
      return foundVersion;
    }

    const activeVersions = await this.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    });

    let selectedVersion: string;
    const activeVersionsTag = activeVersions.map((version) => version.name);

    switch (codeGeneratorStrategy) {
      case CodeGeneratorVersionStrategy.LatestMinor:
        selectedVersion = await this.getLatestMinorVersion(
          activeVersionsTag,
          codeGeneratorVersion
        );
        break;
      case CodeGeneratorVersionStrategy.LatestMajor:
      default:
        selectedVersion = await this.getLatestVersion(activeVersionsTag);
        break;
    }

    return activeVersions.find((version) => version.name === selectedVersion);
  }

  async findMany<T extends Prisma.VersionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.VersionFindManyArgs>
  ): Promise<Version[]> {
    const result: Version[] = [];

    if (this.includeDevVersion) {
      result.push(this.devVersion);
    }
    result.push(...(await super.findMany(args)));
    return result;
  }

  async syncVersions(): Promise<void> {
    this.logger.info("Syncing versions");

    try {
      const tags = await this.awsEcrService.getTags();
      const versions = tags.map((tag) => ({
        id: tag.imageTags[0],
        name: tag.imageTags[0],
        isActive: false,
        createdAt: tag.imagePushedAt,
        updatedAt: new Date(),
        changelog: "",
        deletedAt: null,
        isDeprecated: false,
      }));

      const storedVersions = await this.findMany({});

      const newVersions = versions.filter(
        (version) =>
          !storedVersions.some(
            (storedVersion) => storedVersion.name === version.name
          )
      );

      await this.prisma.version.createMany({
        data: newVersions,
      });

      const deletedVersions = storedVersions.filter(
        (storedVersion) =>
          !versions.some((version) => version.name === storedVersion.name)
      );
      if (deletedVersions.length > 0) {
        await this.prisma.version.updateMany({
          data: {
            deletedAt: new Date(),
            isActive: false,
            isDeprecated: true,
          },
          where: {
            id: {
              in: deletedVersions.map((version) => version.id),
            },
          },
        });
      }
      this.logger.info("Synced versions successfully");
    } catch (error) {
      this.logger.error("Failed to sync versions", error, {
        stack: error.stack,
      });
      throw error;
    }
  }
}
