import { DSGResourceData } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";

export enum EnumDomainType {
  Server = "server",
  AdminUI = "admin-ui",
}

type ResourceTuple = [EnumDomainType, DSGResourceData];

@Injectable()
export class CodeGeneratorSplitterService {
  splitJobs(dsgResourceData: DSGResourceData): ResourceTuple[] {
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
      jobs.push([EnumDomainType.Server, serverDSGResourceData]);
    }

    if (generateAdminUI) {
      const adminUiDSGResourceData: DSGResourceData =
        cloneDeep(dsgResourceData);
      adminUiDSGResourceData.resourceInfo.settings.serverSettings.generateServer =
        false;
      jobs.push([EnumDomainType.AdminUI, adminUiDSGResourceData]);
    }

    return jobs;
  }

  /**
   * This function extracts the buildId from the buildId with suffix.
   * It's needed because the buildId is used as a key in the Kafka messages and and as a folder name in the artifacts and when it
   * interacts with the data-service-generator and the server it needs to be without the suffix.
   * @param buildIdWithSuffix the buildId with suffix which in this case could be "-server" or "-admin-ui"
   * @returns return the substring before the first hyphen or the whole string if there is no hyphen
   */
  extractBuildId(buildIdWithSuffix: string): string {
    const regexPattern = `-(?:${EnumDomainType.Server}|${EnumDomainType.AdminUI})$`;
    const regex = new RegExp(regexPattern);

    return buildIdWithSuffix.replace(regex, "");
  }
}
