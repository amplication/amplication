import { ServiceSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';
import { BlockValues, BlockValuesExtended } from '../block/types';

export type ServiceSettingsValues = BlockValues<ServiceSettingsValuesExtended>;

export type ServiceSettingsValuesExtended = BlockValuesExtended<
  ServiceSettings
>;

export const DEFAULT_SERVICE_SETTINGS: ServiceSettingsValuesExtended = {
  blockType: EnumBlockType.ServiceSettings,
  description: 'Default service settings',
  displayName: 'Service Settings',
  dbHost: 'localhost',
  dbName: '',
  dbUser: 'admin',
  dbPassword: 'admin',
  dbPort: 5432,
  authProvider: EnumAuthProviderType.Jwt,
  serverSettings: {
    generateGraphQL: true,
    generateRestApi: true,
    serverPath: ''
  },
  adminUISettings: {
    generateAdminUI: true,
    adminUIPath: ''
  }
};
