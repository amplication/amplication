import { DSGResourceData } from "@amplication/code-gen-types";
import entities from "./entities";
import roles from "./roles";
import { appInfo } from "./appInfo";
import { EnumResourceType } from "@amplication/code-gen-types";
import { moduleActions, moduleContainers, moduleDtos } from "./modules";

export const TEST_DATA: DSGResourceData = {
  entities,
  buildId: "example_build_id",
  roles,
  resourceInfo: appInfo,
  resourceType: EnumResourceType.Service,
  pluginInstallations: [],
  moduleActions,
  moduleContainers,
  moduleDtos: moduleDtos,
};
