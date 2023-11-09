import { DSGResourceData } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { BuildId, EnumDomainName, EnumEventStatus, RedisValue } from "../types";
import { RedisService } from "../redis/redis.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

type ResourceTuple = [EnumDomainName, DSGResourceData];
@Injectable()
export class CodeGeneratorSplitterService {
  // TODO: rename to CodeGeneratorJobHandlerService (?)
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: AmplicationLogger
  ) {}

  async splitJobs(
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
      await this.setServerJobInProgress(buildId);
      jobs.push([EnumDomainName.Server, serverDSGResourceData]);
    }

    if (generateAdminUI) {
      const adminUiDSGResourceData: DSGResourceData =
        cloneDeep(dsgResourceData);
      adminUiDSGResourceData.resourceInfo.settings.serverSettings.generateServer =
        false;
      await this.setAdminUIJobInProgress(buildId);
      jobs.push([EnumDomainName.AdminUI, adminUiDSGResourceData]);
    }

    return jobs;
  }

  async setServerJobInProgress(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.InProgress,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobInProgress(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.InProgress,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setServerJobSuccess(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Success,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobSuccess(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Success,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setServerJobFailure(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Failure,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobFailure(key: BuildId): Promise<string | null> {
    const prevValue = await this.redisService.get<RedisValue>(key);
    const value = {
      ...prevValue,
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Failure,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  /**
   * This function calculate the job status for a given build id.
   * It checks if the redis key (build id) holds the server and admin-ui jobs, or only one of them.
   * It checks the status of each job and returns the relevant status of the whole build.
   * Only when both jobs are in success it will return success
   * If one of the jobs failed it will set the other job as failure and return failure.
   * When we check again for the status and 2 jobs are in failure it will return null in order to know that we don't want to emit
   * Otherwise it will return in progress. (we are doing it to prevent 2 emits of the same event)
   * @param key the build id
   * @returns the job status of the build id.
   */
  async getJobStatus(key: BuildId): Promise<EnumEventStatus | null> {
    const value = await this.redisService.get<RedisValue>(key);
    const hasServerAndAdmin =
      value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    const hasOnlyServer =
      value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      !value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    const hasOnlyAdmin =
      !value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    if (hasServerAndAdmin) {
      const serverStatus = value[`${key}-${EnumDomainName.Server}`];
      const adminUIStatus = value[`${key}-${EnumDomainName.AdminUI}`];

      if (
        serverStatus === EnumEventStatus.Success &&
        adminUIStatus === EnumEventStatus.Success
      ) {
        this.logger.debug("success status:", { serverStatus, adminUIStatus });
        return EnumEventStatus.Success;
      } else if (
        serverStatus === EnumEventStatus.Failure ||
        adminUIStatus === EnumEventStatus.Failure
      ) {
        if (
          serverStatus === EnumEventStatus.Failure &&
          adminUIStatus === EnumEventStatus.Failure
        ) {
          // at this point, as we want to emit a failure event when one of the jobs failed, we don't care about the other job status
          return null;
        }
        // check who failed and set the other job as failure
        if (serverStatus === EnumEventStatus.Failure) {
          await this.setAdminUIJobFailure(key);
        } else {
          await this.setServerJobFailure(key);
        }
        this.logger.debug("failure status:", { serverStatus, adminUIStatus });
        return EnumEventStatus.Failure;
      } else {
        // for any other case we return in progress
        this.logger.debug("in progress status:", {
          serverStatus,
          adminUIStatus,
        });
        return EnumEventStatus.InProgress;
      }
    }

    if (hasOnlyServer) {
      const serverStatus = value[`${key}-${EnumDomainName.Server}`];
      this.logger.debug("job status has only server", {
        serverStatus,
      });
      return serverStatus;
    }

    if (hasOnlyAdmin) {
      const adminUIStatus = value[`${key}-${EnumDomainName.AdminUI}`];
      this.logger.debug("job status has only admin-ui", { adminUIStatus });
      return adminUIStatus;
    }
  }

  async setJobStatusBasedOnArtifact(
    domainName: string,
    isSuccess: boolean,
    buildId: string
  ) {
    if (isSuccess) {
      if (domainName === EnumDomainName.Server) {
        await this.setServerJobSuccess(buildId);
      } else if (domainName === EnumDomainName.AdminUI) {
        await this.setAdminUIJobSuccess(buildId);
      }
      this.logger.debug(`${domainName} status set to success}`);
    } else {
      if (domainName === EnumDomainName.Server) {
        await this.setServerJobFailure(buildId);
      } else if (domainName === EnumDomainName.AdminUI) {
        await this.setAdminUIJobFailure(buildId);
      }
      this.logger.debug(`${domainName} status set to failure`);
      // TODO: do we want to throw (and the caller will catch) an error here or wait for the job status?
    }
  }

  /**
   * This function is called when the code generation job failed. We set the job status of the relevant domain to failure.
   * For 2 build jobs this function might be called twice (once for each domain), but after we call it we also call the getJobStatus
   * function which will return the relevant status of the whole build.
   * @param key the build id
   * @param domainName server / admin-ui
   */
  async setJobStatusWhenCodeGenerationFailed(key: BuildId, domainName: string) {
    if (domainName === EnumDomainName.Server) {
      await this.setServerJobFailure(key);
    } else if (domainName === EnumDomainName.AdminUI) {
      await this.setAdminUIJobFailure(key);
    }
  }

  /**
   * This function extracts the buildId from the buildId with suffix.
   * It's needed because the buildId is used as a key in the Kafka messages and and as a folder name in the artifacts and when it
   * interacts with the data-service-generator and the server it needs to be without the suffix.
   * if the buildId doesn't contain the suffix it will return the whole string
   * @param buildId the buildId with suffix which in this case could be "-server" or "-admin-ui"
   * @returns return the substring before the first hyphen or the whole string if there is no hyphen
   */
  extractBuildId(buildId: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    if (!regex.test(buildId)) {
      return buildId;
    }

    return buildId.replace(regex, "");
  }

  extractDomainName(buildIdWithSuffix: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    // return the suffix without the hyphen
    return buildIdWithSuffix.match(regex)?.[0].slice(1);
  }
}
