import { Injectable, Inject } from '@nestjs/common';
import { AppSettings, UpdateAppSettingsArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_APP_SETTINGS, AppSettingsValues } from './constants';
import { isEmpty } from 'lodash';

@Injectable()
export class AppSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  async getAppSettingsValues(args: FindOneArgs): Promise<AppSettingsValues> {
    const {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser
    } = await this.getAppSettingsBlock(args);

    return {
      dbHost,
      dbName,
      dbPassword,
      dbPort,
      dbUser,
      appId: args.where.id
    };
  }

  async getAppSettingsBlock(args: FindOneArgs): Promise<AppSettings> {
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
      return this.createDefaultAppSettings(args.where.id);
    }

    return appSettings;
  }

  async updateAppSettings(args: UpdateAppSettingsArgs): Promise<AppSettings> {
    const appSettingsBlock = await this.getAppSettingsBlock({
      where: { id: args.where.id }
    });

    return this.blockService.update<AppSettings>({
      where: {
        id: appSettingsBlock.id
      },
      data: args.data
    });
  }

  async createDefaultAppSettings(appId: string): Promise<AppSettings> {
    return this.blockService.create<AppSettings>({
      data: {
        app: {
          connect: {
            id: appId
          }
        },
        ...DEFAULT_APP_SETTINGS,
        blockType: EnumBlockType.AppSettings
      }
    });
  }
}
