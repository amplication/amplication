import { ResourceSettings } from "./dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockValues, BlockValuesExtended } from "../block/types";

export type ResourceSettingsValues =
  BlockValues<ResourceSettingsValuesExtended>;

export type ResourceSettingsValuesExtended = Omit<
  BlockValuesExtended<ResourceSettings>,
  "id"
>;

export const DEFAULT_SERVICE_SETTINGS: ResourceSettingsValuesExtended = {
  blockType: EnumBlockType.ResourceSettings,
  description: "Default resource settings",
  displayName: "Resource Settings",
  properties: {},
};
