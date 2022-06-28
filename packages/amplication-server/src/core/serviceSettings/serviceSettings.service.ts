import { Injectable, Inject } from '@nestjs/common';
import { ServiceSettings, UpdateServiceSettingsArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_SERVICE_SETTINGS, ServiceSettingsValues } from './constants';
import { isEmpty } from 'lodash';
import { User } from 'src/models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

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
      authProvider
    } = await this.getServiceSettingsBlock(args, user);

    return {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      resourceId: args.where.id,
      authProvider
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
    if (isEmpty(serviceSettings)) {
      return this.createDefaultServiceSettings(args.where.id, user);
    }

    return {
      ...serviceSettings,
      authProvider: serviceSettings.authProvider || EnumAuthProviderType.Http
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
        data: args.data
      },
      user
    );
  }

  async createDefaultServiceSettings(
    resourceId: string,
    user: User
  ): Promise<ServiceSettings> {
    return this.blockService.create<ServiceSettings>(
      {
        data: {
          resource: {
            connect: {
              id: resourceId
            }
          },
          ...DEFAULT_SERVICE_SETTINGS,
          blockType: EnumBlockType.ServiceSettings
        }
      },
      user
    );
  }
}
