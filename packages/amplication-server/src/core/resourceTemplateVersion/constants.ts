import { ResourceTemplateVersion } from "./dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockValues, BlockValuesExtended } from "../block/types";

export type ResourceTemplateVersionValues =
  BlockValues<ResourceTemplateVersionValuesExtended>;

export type ResourceTemplateVersionValuesExtended = Omit<
  BlockValuesExtended<ResourceTemplateVersion>,
  "id"
>;

export const DEFAULT_RESOURCE_TEMPLATE_VERSION: ResourceTemplateVersionValuesExtended =
  {
    blockType: EnumBlockType.ResourceTemplateVersion,
    description: "Resource Template Version",
    displayName: "Resource Template Version",
    serviceTemplateId: null,
    version: null,
  };
