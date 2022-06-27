import { Injectable, Inject } from '@nestjs/common';
import { AppSettings, UpdateAppSettingsArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_APP_SETTINGS, AppSettingsValues } from './constants';
import { User } from 'src/models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

export const isStringBool = (val: any) =>
  typeof val === 'boolean' || typeof val === 'string';

@Injectable()
export class AppSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  async getAppSettingsValues(
    args: FindOneArgs,
    user: User
  ): Promise<AppSettingsValues> {
    const {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      authProvider,
      serverSettings,
      adminUISettings
    } = await this.getAppSettingsBlock(args, user);

    return {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      appId: args.where.id,
      authProvider,
      serverSettings,
      adminUISettings
    };
  }

  async getAppSettingsBlock(
    args: FindOneArgs,
    user: User
  ): Promise<AppSettings> {
    const [appSettings] = await this.blockService.findManyByBlockType<
      AppSettings
    >(
      {
        where: {
          app: {
            id: args.where.id
          }
        }
      },
      EnumBlockType.AppSettings
    );

    return {
      ...appSettings,
      authProvider: appSettings.authProvider || EnumAuthProviderType.Jwt,
      ...(!appSettings.hasOwnProperty('serverSettings') ||
      !appSettings.hasOwnProperty('adminUISettings')
        ? this.updateAppSettings(
            {
              data: {
                ...appSettings,
                serverSettings: {
                  generateGraphQL: true,
                  generateRestApi: true,
                  serverPath: ''
                },
                adminUISettings: {
                  generateAdminUI: true,
                  adminUIPath: ''
                }
              },
              where: {
                id: args.where.id
              }
            },
            user
          )
        : {})
    };
  }

  async updateAppSettings(
    args: UpdateAppSettingsArgs,
    user: User
  ): Promise<AppSettings> {
    const appSettingsBlock = await this.getAppSettingsBlock(
      {
        where: { id: args.where.id }
      },
      user
    );

    return this.blockService.update<AppSettings>(
      {
        where: {
          id: appSettingsBlock.id
        },
        data: {
          ...appSettingsBlock,
          ...args.data,
          adminUISettings: {
            adminUIPath: isStringBool(args.data?.adminUISettings?.adminUIPath)
              ? args.data?.adminUISettings?.adminUIPath
              : appSettingsBlock.adminUISettings.adminUIPath,
            generateAdminUI: isStringBool(
              args.data?.adminUISettings?.generateAdminUI
            )
              ? args.data?.adminUISettings?.generateAdminUI
              : appSettingsBlock.adminUISettings.generateAdminUI
          },
          ...{
            serverSettings: {
              generateGraphQL: isStringBool(
                args.data?.serverSettings?.generateGraphQL
              )
                ? args.data?.serverSettings?.generateGraphQL
                : appSettingsBlock.serverSettings.generateGraphQL,
              generateRestApi: isStringBool(
                args.data?.serverSettings?.generateRestApi
              )
                ? args.data?.serverSettings?.generateRestApi
                : appSettingsBlock.serverSettings.generateRestApi,
              serverPath: isStringBool(args.data?.serverSettings?.serverPath)
                ? args.data?.serverSettings?.serverPath
                : appSettingsBlock.serverSettings.serverPath
            }
          },
          ...(!args.data.serverSettings.generateGraphQL
            ? {
                adminUISettings: {
                  adminUIPath: isStringBool(
                    args.data?.adminUISettings?.adminUIPath
                  )
                    ? args.data?.adminUISettings?.adminUIPath
                    : appSettingsBlock.adminUISettings.adminUIPath,
                  generateAdminUI: false
                }
              }
            : {})
        }
      },
      user
    );
  }

  async createDefaultAppSettings(
    appId: string,
    user: User
  ): Promise<AppSettings> {
    return this.blockService.create<AppSettings>(
      {
        data: {
          app: {
            connect: {
              id: appId
            }
          },
          ...DEFAULT_APP_SETTINGS,
          blockType: EnumBlockType.AppSettings
        }
      },
      user
    );
  }
}
