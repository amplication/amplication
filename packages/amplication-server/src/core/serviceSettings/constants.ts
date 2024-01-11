import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockValues, BlockValuesExtended } from "../block/types";
import { ServiceSettings } from "./dto";
import { EnumAuthProviderType } from "./dto/EnumAuthenticationProviderType";

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
    generateServer: true,
    serverPath: "",
  },
  adminUISettings: {
    generateAdminUI: true,
    adminUIPath: "",
  },
};
