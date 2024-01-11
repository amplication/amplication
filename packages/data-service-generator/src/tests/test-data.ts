import { appInfo } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { DSGResourceData } from "@amplication/code-gen-types";
import { EnumResourceType } from "@amplication/code-gen-types/models";

export const TEST_DATA: DSGResourceData = {
  entities,
  buildId: "example_build_id",
  roles,
  resourceInfo: appInfo,
  resourceType: EnumResourceType.Service,
  pluginInstallations: [],
  moduleActions: [],
  moduleContainers: [],
};
