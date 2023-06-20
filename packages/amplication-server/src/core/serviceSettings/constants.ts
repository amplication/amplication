import { ServiceSettings } from "./dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumAuthProviderType } from "./dto/EnumAuthenticationProviderType";
import { BlockValues, BlockValuesExtended } from "../block/types";

export type ServiceSettingsValues = BlockValues<ServiceSettingsValuesExtended>;

export type ServiceSettingsValuesExtended = Omit<
  BlockValuesExtended<ServiceSettings>,
  "id"
>;

export const DEFAULT_SERVICE_SETTINGS: ServiceSettingsValuesExtended = {
  blockType: EnumBlockType.ServiceSettings,
  description: "Default service settings",
  displayName: "Service Settings",
  authProvider: EnumAuthProviderType.Jwt,
  serverSettings: {
    generateGraphQL: true,
    generateRestApi: true,
    serverPath: "",
  },
  adminUISettings: {
    generateAdminUI: true,
    adminUIPath: "",
  },
};
