import { Injectable, Inject } from '@nestjs/common';
import { AppSettings, UpdateAppSettingsArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_APP_SETTINGS, AppSettingsValues } from './constants';
import { isEmpty } from 'lodash';
import { User } from 'src/models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

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
      authProvider
    } = await this.getAppSettingsBlock(args, user);

    return {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      appId: args.where.id,
      authProvider
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
    if (isEmpty(appSettings)) {
      return this.createDefaultAppSettings(args.where.id, user);
    }

    return {
      ...appSettings,
      authProvider: appSettings.authProvider || EnumAuthProviderType.Http
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
        data: args.data
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
