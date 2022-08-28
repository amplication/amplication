import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { FindOneArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { User } from 'src/models';
import { BlockService } from '../block/block.service';
import { BlockValuesExtended } from '../block/types';
import { ProjectConfigurationSettings } from './dto/ProjectConfigurationSettings';
import { UpdateProjectConfigurationSettingsArgs } from './dto/UpdateProjectConfigurationSettingsArgs';
import { ProjectConfigurationSettingsExistError } from './errors/ProjectConfigurationSettingsExistError';

const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME =
  'Project Configuration Settings';
const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION =
  'This block is used to store project configuration settings.';

export const DEFAULT_PROJECT_CONFIGURATION_SETTINGS: BlockValuesExtended<ProjectConfigurationSettings> = {
  baseDirectory: '/',
  blockType: EnumBlockType.ProjectConfigurationSettings,
  description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
  displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME
};

@Injectable()
export class ProjectConfigurationSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  async createDefault(
    resourceId: string,
    userId: string
  ): Promise<ProjectConfigurationSettings> {
    const existingProjectConfigurationSettings = await this.findOne({
      where: { id: resourceId }
    });

    if (!isEmpty(existingProjectConfigurationSettings)) {
      throw new ProjectConfigurationSettingsExistError();
    }

    const projectConfigurationSettings = this.blockService.create<
      ProjectConfigurationSettings
    >(
      {
        data: {
          resource: {
            connect: {
              id: resourceId
            }
          },
          ...DEFAULT_PROJECT_CONFIGURATION_SETTINGS
        }
      },
      userId
    );
    return projectConfigurationSettings;
  }

  async update(
    args: UpdateProjectConfigurationSettingsArgs,
    user: User
  ): Promise<ProjectConfigurationSettings> {
    const projectConfigurationSettings = await this.findOne({
      where: args.where
    });

    return this.blockService.update<ProjectConfigurationSettings>(
      {
        ...args,
        where: { id: projectConfigurationSettings.id },
        ...projectConfigurationSettings
      },
      user
    );
  }

  async findOne(args: FindOneArgs): Promise<ProjectConfigurationSettings> {
    const [
      projectConfigurationSettings
    ] = await this.blockService.findManyByBlockType<
      ProjectConfigurationSettings
    >(
      {
        where: {
          resource: {
            id: args.where.id
          }
        }
      },
      EnumBlockType.ProjectConfigurationSettings
    );
    return projectConfigurationSettings;
  }
}
