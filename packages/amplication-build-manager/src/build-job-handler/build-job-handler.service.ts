import { DSGResourceData, EnumResourceType } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import {
  BuildId,
  JobBuildId,
  EnumDomainName,
  EnumJobStatus,
  RedisValue,
} from "../types";
import { RedisService } from "../redis/redis.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { promises as fs } from "fs";
import { join } from "path";

type ResourceTuple = [JobBuildId<BuildId>, DSGResourceData];
@Injectable()
export class BuildJobsHandlerService {
  private readonly minDsgVersionToSplitBuild: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService<Env, true>,
    private readonly codeGeneratorService: CodeGeneratorService
  ) {
    this.minDsgVersionToSplitBuild = this.configService.getOrThrow(
      Env.FEATURE_SPLIT_JOBS_MIN_DSG_VERSION
    );
  }

  async splitBuildsIntoJobs(
    dsgResourceData: DSGResourceData,
    buildId: BuildId,
    codeGeneratorVersion: string
  ): Promise<ResourceTuple[]> {
    const shouldSplitBuild =
      dsgResourceData.resourceType === EnumResourceType.Service &&
      codeGeneratorVersion !== "latest-local" &&
      this.codeGeneratorService.compareVersions(
        codeGeneratorVersion,
        this.minDsgVersionToSplitBuild
      ) >= 0;

    const jobs: ResourceTuple[] = [];
    if (shouldSplitBuild) {
      const {
        resourceInfo: {
          settings: {
            serverSettings: { generateServer },
            adminUISettings: { generateAdminUI },
          },
        },
      } = dsgResourceData;

      if (generateServer) {
        const serverDSGResourceData: DSGResourceData =
          cloneDeep(dsgResourceData);
        serverDSGResourceData.resourceInfo.settings.adminUISettings.generateAdminUI =
          false;
        const jobBuildId = this.generateJobBuildId(
          buildId,
          EnumDomainName.Server
        );
        await this.setJobStatus(jobBuildId, EnumJobStatus.InProgress);
        jobs.push([jobBuildId, serverDSGResourceData]);
      }

      if (generateAdminUI) {
        const adminUiDSGResourceData: DSGResourceData =
          cloneDeep(dsgResourceData);
        adminUiDSGResourceData.resourceInfo.settings.serverSettings.generateServer =
          false;
        const jobBuildId = this.generateJobBuildId(
          buildId,
          EnumDomainName.AdminUI
        );

        await this.setJobStatus(jobBuildId, EnumJobStatus.InProgress);
        jobs.push([jobBuildId, adminUiDSGResourceData]);
      }
    } else {
      await this.setJobStatus(buildId, EnumJobStatus.InProgress);
      jobs.push([buildId, dsgResourceData]);
    }

    return jobs;
  }

  generateJobBuildId(
    buildId: BuildId,
    domain: EnumDomainName
  ): JobBuildId<BuildId> {
    return `${buildId}-${domain}`;
  }

  // accumulate the status of the jobs and return the status of the whole build
  async getBuildStatus(key: BuildId): Promise<EnumJobStatus> {
    const buildValue = await this.redisService.get<RedisValue>(key);
    const jobsStatus = Object.values(buildValue);

    const allSucceeded = jobsStatus.every(
      (status) => status === EnumJobStatus.Success
    );

    if (allSucceeded) return EnumJobStatus.Success;

    const atLeaseOneFailed = jobsStatus.some(
      (status) => status === EnumJobStatus.Failure
    );

    if (atLeaseOneFailed) return EnumJobStatus.Failure;

    const atLeastOneInProgress = jobsStatus.some(
      (status) => status === EnumJobStatus.InProgress
    );

    if (atLeastOneInProgress) return EnumJobStatus.InProgress;
  }

  async getJobStatus(jobBuildId: JobBuildId<BuildId>): Promise<EnumJobStatus> {
    const key = this.extractBuildId(jobBuildId);
    const value = await this.redisService.get<RedisValue>(key);
    this.logger.debug("Job status", { value });
    return value[jobBuildId];
  }

  /**
   * Set / update the status of a job
   * First it gets the current value of the key (buildId)
   * Then it updates the value by accessing the jobBuildId property
   * If the key yet doesn't exist, currentVal will return null, but it won't throw an error because spreading null is ok (obj = {...null} = {})
   * @param jobBuildId buildId with domain name suffix (server / admin-ui)
   * @param status EnumJobStatus (in-progress / success / failure)
   */
  async setJobStatus(jobBuildId: string, status: EnumJobStatus): Promise<void> {
    const key = this.extractBuildId(jobBuildId);
    const currentVal = await this.redisService.get<RedisValue>(key);
    const newVal = {
      ...currentVal,
      [jobBuildId]: status,
    };
    this.logger.debug("Updating job status...", { newVal });
    await this.redisService.set<RedisValue>(key, newVal);
  }

  /**
   * This function extracts the buildId from the buildId with suffix.
   * It's needed because the buildId is used as a key in the Kafka messages and and as a folder name in the artifacts and when it
   * interacts with the data-service-generator and the server it needs to be without the suffix.
   * if the buildId doesn't contain the suffix it will return the whole string
   * @param buildId the buildId with suffix which in this case could be "-server" or "-admin-ui"
   * @returns return the substring before the first hyphen or the whole string if there is no hyphen
   */
  extractBuildId(jobBuildId: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    if (!regex.test(jobBuildId)) {
      return jobBuildId;
    }

    return jobBuildId.replace(regex, "");
  }

  extractDomain(jobBuildId: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    if (!regex.test(jobBuildId)) {
      return null;
    }

    return regex.exec(jobBuildId)[0].replace("-", "");
  }

  async extractDsgResourceData(jobBuildId: string): Promise<DSGResourceData> {
    const data = await fs.readFile(
      join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        jobBuildId,
        this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
      )
    );

    return <DSGResourceData>JSON.parse(data.toString());
  }
}
