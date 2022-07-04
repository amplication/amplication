import { AppSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

export type AppSettingsValues = Omit<
  AppSettingsValuesExtended,
  'blockType' | 'description' | 'displayName'
> & { resourceId: string };

export type AppSettingsValuesExtended = Omit<
  AppSettings,
  | 'createdAt'
  | 'updatedAt'
  | 'id'
  | 'parentBlock'
  | 'versionNumber'
  | 'inputParameters'
  | 'outputParameters'
  | 'lockedByUserId'
  | 'lockedAt'
  | 'resourceId'
>;

export const DEFAULT_RESOURCE_SETTINGS: AppSettingsValuesExtended = {
  blockType: EnumBlockType.AppSettings,
  description: 'Default resource settings',
  displayName: 'Resource Settings',
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
