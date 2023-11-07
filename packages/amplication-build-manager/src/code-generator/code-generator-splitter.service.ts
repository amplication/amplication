import { DSGResourceData } from "@amplication/code-gen-types";
import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";

enum EnumDomainType {
  Server = "server",
  AdminUI = "admin-ui",
}

type ResourceTuple = [EnumDomainType, DSGResourceData];

@Injectable()
export class CodeGeneratorSplitterService {
  splitJobs(dsgResourceData: DSGResourceData): ResourceTuple[] {
    const generateServer =
      dsgResourceData.resourceInfo.settings.serverSettings.generateServer;
    const generateAdminUI =
      dsgResourceData.resourceInfo.settings.adminUISettings.generateAdminUI;

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
}
