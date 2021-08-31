import { AppSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';
import { EnumJwtTimeScaleType } from './dto/EnumJwtTimeScaleType';

export type AppSettingsValues = Omit<
  AppSettingsValuesExtended,
  'blockType' | 'description' | 'displayName'
> & { appId: string };

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
  | 'appId'
>;

export const DEFAULT_APP_SETTINGS: AppSettingsValuesExtended = {
  blockType: EnumBlockType.AppSettings,
  description: 'Default app settings',
  displayName: 'App Settings',
  dbHost: 'localhost',
  dbName: '',
  dbUser: 'admin',
  dbPassword: 'admin',
  dbPort: 5432,
  authProvider: EnumAuthProviderType.Jwt,
  appUserName: 'admin',
  appPassword: 'admin',
  jwtExpireTimeScale: EnumJwtTimeScaleType.Day
};
