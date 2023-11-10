import { DSGResourceData } from "@amplication/code-gen-types";
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

type ResourceTuple = [JobBuildId<BuildId>, DSGResourceData];
@Injectable()
export class CodeGeneratorSplitterService {
  // TODO: rename to CodeGeneratorJobHandlerService (?)
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: AmplicationLogger
  ) {}

  /**
   * Splits the build into x jobs
   * Currently we have 2 jobs: server and admin-ui
   * Or only one if the user chose to build only one of them
   */
  async splitBuildsIntoJobs(
    dsgResourceData: DSGResourceData,
    buildId: BuildId
  ): Promise<ResourceTuple[]> {
    const {
      resourceInfo: {
        settings: {
          serverSettings: { generateServer },
          adminUISettings: { generateAdminUI },
        },
      },
    } = dsgResourceData;

    const jobs: ResourceTuple[] = [];
    if (generateServer) {
      const serverDSGResourceData: DSGResourceData = cloneDeep(dsgResourceData);
      serverDSGResourceData.resourceInfo.settings.adminUISettings.generateAdminUI =
        false;
      const jobBuildId: JobBuildId<BuildId> = `${buildId}-${EnumDomainName.Server}`;
      await this.setJobStatus(jobBuildId, EnumJobStatus.InProgress);
      jobs.push([jobBuildId, serverDSGResourceData]);
    }

    if (generateAdminUI) {
      const adminUiDSGResourceData: DSGResourceData =
        cloneDeep(dsgResourceData);
      adminUiDSGResourceData.resourceInfo.settings.serverSettings.generateServer =
        false;
      const jobBuildId: JobBuildId<BuildId> = `${buildId}-${EnumDomainName.AdminUI}`;
      await this.setJobStatus(jobBuildId, EnumJobStatus.InProgress);
      jobs.push([jobBuildId, adminUiDSGResourceData]);
    }

    return jobs;
  }

  // accumulate the status of the jobs and return the status of the whole build
  async getBuildStatus(key: BuildId): Promise<EnumJobStatus | null> {
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

  async getJobStatus(jobBuildId: JobBuildId<BuildId>) {
    const key = this.extractBuildId(jobBuildId);
    const value = await this.redisService.get<RedisValue>(key);
    this.logger.debug("Job status", { value });
    return value[jobBuildId];
  }

  async setJobStatus(jobBuildId: JobBuildId<BuildId>, status: EnumJobStatus) {
    const key = this.extractBuildId(jobBuildId);
    const currentVal = await this.redisService.get<RedisValue>(key);
    const newVal = {
      ...currentVal,
      [jobBuildId]: status,
    };
    this.logger.debug("Setting new job status", { newVal });
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
  extractBuildId(jobBuildId: JobBuildId<BuildId>): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    if (!regex.test(jobBuildId)) {
      return jobBuildId;
    }

    return jobBuildId.replace(regex, "");
  }
}
