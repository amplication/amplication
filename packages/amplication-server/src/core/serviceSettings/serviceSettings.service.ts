import { Injectable, Inject } from '@nestjs/common';
import { ServiceSettings, UpdateServiceSettingsArgs } from './dto';
import { FindOneArgs } from '../../dto';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from '../../enums/EnumBlockType';
import {
  DEFAULT_SERVICE_SETTINGS,
  ServiceSettingsValues,
  ServiceSettingsValuesExtended
} from './constants';
import { User } from '../../models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';
import { ResourceGenSettingsCreateInput } from '../resource/dto/ResourceGenSettingsCreateInput';

export const isStringBool = (val: string | boolean): boolean =>
  typeof val === 'boolean' || typeof val === 'string';

@Injectable()
export class ServiceSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  async getServiceSettingsValues(
    args: FindOneArgs,
    user: User
  ): Promise<ServiceSettingsValues> {
    const {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      authProvider,
      serverSettings,
      adminUISettings
    } = await this.getServiceSettingsBlock(args, user);

    return {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      resourceId: args.where.id,
      authProvider,
      serverSettings,
      adminUISettings
    };
  }

  async getServiceSettingsBlock(
    args: FindOneArgs,
    user: User
  ): Promise<ServiceSettings> {
    const [serviceSettings] = await this.blockService.findManyByBlockType<
      ServiceSettings
    >(
      {
        where: {
          resource: {
            id: args.where.id
          }
        }
      },
      EnumBlockType.ServiceSettings
    );

    return {
      ...serviceSettings,
      authProvider: serviceSettings.authProvider || EnumAuthProviderType.Jwt,
      ...(!serviceSettings.hasOwnProperty('serverSettings') ||
      !serviceSettings.hasOwnProperty('adminUISettings')
        ? this.updateServiceSettings(
            {
              data: {
                ...serviceSettings,
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

  async updateServiceSettings(
    args: UpdateServiceSettingsArgs,
    user: User
  ): Promise<ServiceSettings> {
    const serviceSettingsBlock = await this.getServiceSettingsBlock(
      {
        where: { id: args.where.id }
      },
      user
    );

    return this.blockService.update<ServiceSettings>(
      {
        where: {
          id: serviceSettingsBlock.id
        },
        data: {
          ...serviceSettingsBlock,
          ...args.data,
          adminUISettings: {
            adminUIPath: isStringBool(args.data?.adminUISettings?.adminUIPath)
              ? args.data?.adminUISettings?.adminUIPath
              : serviceSettingsBlock.adminUISettings.adminUIPath,
            generateAdminUI: isStringBool(
              args.data?.adminUISettings?.generateAdminUI
            )
              ? args.data?.adminUISettings?.generateAdminUI
              : serviceSettingsBlock.adminUISettings.generateAdminUI
          },
          ...{
            serverSettings: {
              generateGraphQL: isStringBool(
                args.data?.serverSettings?.generateGraphQL
              )
                ? args.data?.serverSettings?.generateGraphQL
                : serviceSettingsBlock.serverSettings.generateGraphQL,
              generateRestApi: isStringBool(
                args.data?.serverSettings?.generateRestApi
              )
                ? args.data?.serverSettings?.generateRestApi
                : serviceSettingsBlock.serverSettings.generateRestApi,
              serverPath: isStringBool(args.data?.serverSettings?.serverPath)
                ? args.data?.serverSettings?.serverPath
                : serviceSettingsBlock.serverSettings.serverPath
            }
          },
          ...(!args.data.serverSettings.generateGraphQL
            ? {
                adminUISettings: {
                  adminUIPath: isStringBool(
                    args.data?.adminUISettings?.adminUIPath
                  )
                    ? args.data?.adminUISettings?.adminUIPath
                    : serviceSettingsBlock.adminUISettings.adminUIPath,
                  generateAdminUI: false
                }
              }
            : {})
        }
      },
      user
    );
  }

  async createDefaultServiceSettings(
    resourceId: string,
    user: User,
    generationSettings: ResourceGenSettingsCreateInput = null
  ): Promise<ServiceSettings> {
    const settings = DEFAULT_SERVICE_SETTINGS;

    if (generationSettings)
      this.updateServiceGenerationSettings(settings, generationSettings);

    return this.blockService.create<ServiceSettings>(
      {
        data: {
          resource: {
            connect: {
              id: resourceId
            }
          },
          ...settings,
          blockType: EnumBlockType.ServiceSettings
        }
      },
      user.id
    );
  }
  private updateServiceGenerationSettings(
    settings: ServiceSettingsValuesExtended,
    generationSettings: ResourceGenSettingsCreateInput
  ): void {
    (settings.adminUISettings = {
      generateAdminUI: generationSettings.generateAdminUI,
      adminUIPath: ''
    }),
      (settings.serverSettings = {
        generateGraphQL: generationSettings.generateGraphQL,
        generateRestApi: generationSettings.generateRestApi,
        serverPath: ''
      });
  }
}
