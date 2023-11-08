import { DSGResourceData } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { BuildId, EnumDomainName, EnumEventStatus } from "../types";
import { RedisService } from "../redis/redis.service";

type ResourceTuple = [EnumDomainName, DSGResourceData];
@Injectable()
export class CodeGeneratorSplitterService {
  constructor(private readonly redisService: RedisService) {}

  splitJobs(
    dsgResourceData: DSGResourceData,
    buildId: BuildId
  ): ResourceTuple[] {
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
      this.redisService.setServerJobInProgress(buildId);
      jobs.push([EnumDomainName.Server, serverDSGResourceData]);
    }

    if (generateAdminUI) {
      const adminUiDSGResourceData: DSGResourceData =
        cloneDeep(dsgResourceData);
      adminUiDSGResourceData.resourceInfo.settings.serverSettings.generateServer =
        false;
      this.redisService.setAdminUIJobInProgress(buildId);
      jobs.push([EnumDomainName.AdminUI, adminUiDSGResourceData]);
    }

    return jobs;
  }

  serverJobSuccess(buildId: BuildId): Promise<string | null> {
    return this.redisService.setServerJobSuccess(buildId);
  }

  adminUIJobSuccess(buildId: BuildId): Promise<string | null> {
    return this.redisService.setAdminUIJobSuccess(buildId);
  }

  serverJobFailure(buildId: BuildId): Promise<string | null> {
    return this.redisService.setServerJobFailure(buildId);
  }

  adminUIJobFailure(buildId: BuildId): Promise<string | null> {
    return this.redisService.setAdminUIJobFailure(buildId);
  }

  getJobStatus(buildId: BuildId): Promise<EnumEventStatus> {
    return this.redisService.getJobStatus(buildId);
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
