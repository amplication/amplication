import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types";
import axios from "axios";
import { Version } from "./version.interface";
import { Generator } from "./generator.interface";

@Traceable()
@Injectable()
export class CodeGeneratorService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  async getCodeGenerators(generatorName: string): Promise<string | undefined> {
    const catalogServiceUrl = this.configService.get(
      Env.DSG_CATALOG_SERVICE_URL
    );

    try {
      const response = await axios.get(`${catalogServiceUrl}api/generators`);

      return (<Generator[]>response.data).find(
        (generator) => generator.name === generatorName
      )?.fullName;
    } catch (error) {
      throw new Error(error.message, {
        cause: {
          code: error.response?.status,
          message: error.response?.data?.message,
        },
      });
    }
  }

  async getCodeGeneratorVersion({
    codeGeneratorFullName,
    codeGeneratorVersion,
    codeGeneratorStrategy,
  }: {
    codeGeneratorFullName: string;
    codeGeneratorVersion?: string;
    codeGeneratorStrategy?: CodeGeneratorVersionStrategy;
  }): Promise<string | undefined> {
    const catalogServiceUrl = this.configService.get(
      Env.DSG_CATALOG_SERVICE_URL
    );
    try {
      const response = await axios.post(
        `${catalogServiceUrl}api/versions/code-generator-version`,
        {
          codeGeneratorFullName,
          codeGeneratorVersion,
          codeGeneratorStrategy,
        }
      );

      return (<Version>response.data).name;
    } catch (error) {
      throw new Error(error.message, {
        cause: {
          code: error.response?.status,
          message: error.response?.data?.message,
        },
      });
    }
  }

  /**
   * This function compares two versions
   * @param currentVersion the current dsg version
   * @param version a version to compare to
   * @returns a number indicating whether the current version is greater than, less than, or equal to the version
   */
  compareVersions(currentVersion: string, version: string): number {
    // regex for standard semantic versioning strings with a leading "v" (e.g. v1.0.0) and with not prerelease tags
    const semverRegex = /^(v?)(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
    const prereleaseTagRegex = /-[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/;
    const hasPrereleaseTag = (v: string) => prereleaseTagRegex.test(v);

    if (hasPrereleaseTag(currentVersion)) {
      throw new Error(
        `Versions with prerelease tags are not supported. Current version: ${currentVersion}`
      );
    }

    // in sandbox the current version is "next" and in staging it is "master"
    // we return 1 to indicate that the current version is greater than the version
    // for currentVersion we have validation in the pipeline, so for production we will never get here
    if (!semverRegex.test(currentVersion)) {
      return 1;
    }

    if (!semverRegex.test(version)) {
      throw new Error(`Invalid version: ${version}`);
    }

    const parseVersion = (version: string) =>
      version.substring(1).split(".").map(Number);

    const [majorCurrentVersion, minorCurrentVersion, patchCurrentVersion] =
      parseVersion(currentVersion);
    const [majorVersion, minorVersion, patchVersion] = parseVersion(version);

    if (majorCurrentVersion !== majorVersion) {
      return majorCurrentVersion - majorVersion;
    }
    if (minorCurrentVersion !== minorVersion) {
      return minorCurrentVersion - minorVersion;
    }
    return patchCurrentVersion - patchVersion;
  }
}
