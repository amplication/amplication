import {
  AppInfo,
  Entity,
  Plugin,
  Role,
  ServiceTopics,
  Topic,
} from "./code-gen-types";
import { EnumResourceType } from "./models";

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
