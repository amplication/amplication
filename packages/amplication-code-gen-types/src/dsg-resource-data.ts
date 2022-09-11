import { AppInfo, Entity, Plugin, Role } from "./code-gen-types";
import { EnumResourceType, ServiceTopics, Topic } from "./models";

export class DSGResourceData {
  resourceType!: keyof typeof EnumResourceType;
  resourceInfo?: AppInfo;

  entities?: Entity[];
  roles?: Role[];

  plugins!: Plugin[];

  //#region Blocks
  serviceTopics?: ServiceTopics[];
  topics?: Topic[];
  //#endregion

  otherResources?: DSGResourceData[];
}
