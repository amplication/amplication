import { DSGResourceData } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { BuildId, EnumDomainName, EnumEventStatus, RedisValue } from "../types";
import { RedisService } from "../redis/redis.service";

type ResourceTuple = [EnumDomainName, DSGResourceData];
@Injectable()
export class CodeGeneratorSplitterService {
  // TODO: rename to CodeGeneratorJobHandlerService (?)
  constructor(private readonly redisService: RedisService) {}

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
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.InProgress,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobInProgress(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.InProgress,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setServerJobSuccess(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Success,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobSuccess(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Success,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setServerJobFailure(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Failure,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async setAdminUIJobFailure(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Failure,
    };

    return this.redisService.set<RedisValue>(key, value);
  }

  async getJobStatus(key: BuildId): Promise<EnumEventStatus> {
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
        return EnumEventStatus.Success;
      } else if (
        serverStatus === EnumEventStatus.Failure ||
        adminUIStatus === EnumEventStatus.Failure
      ) {
        return EnumEventStatus.Failure;
      }
    }

    if (hasOnlyServer) {
      return value[`${key}-${EnumDomainName.Server}`];
    }

    if (hasOnlyAdmin) {
      return value[`${key}-${EnumDomainName.AdminUI}`];
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
    } else {
      if (domainName === EnumDomainName.Server) {
        await this.setServerJobFailure(buildId);
      } else if (domainName === EnumDomainName.AdminUI) {
        await this.setAdminUIJobFailure(buildId);
      }
      // TODO: do we want to throw (and the caller will catch) an error here or wait for the job status?
    }
  }

  /**
   * This function extracts the buildId from the buildId with suffix.
   * It's needed because the buildId is used as a key in the Kafka messages and and as a folder name in the artifacts and when it
   * interacts with the data-service-generator and the server it needs to be without the suffix.
   * @param buildIdWithSuffix the buildId with suffix which in this case could be "-server" or "-admin-ui"
   * @returns return the substring before the first hyphen or the whole string if there is no hyphen
   */
  extractBuildId(buildIdWithSuffix: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    return buildIdWithSuffix.replace(regex, "");
  }

  extractDomainName(buildIdWithSuffix: string): string {
    const regexPattern = `-(?:${EnumDomainName.Server}|${EnumDomainName.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    const [, domainType] = buildIdWithSuffix.split(regex).pop();
    return domainType;
  }
}
