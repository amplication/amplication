import { Inject, Injectable } from '@nestjs/common';
import { FindOneArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { User } from 'src/models';
import { BlockService } from '../block/block.service';
import { ProjectConfigurationSettings } from './dto/ProjectConfigurationSettings';
import { UpdateProjectConfigurationSettingsArgs } from './dto/UpdateProjectConfigurationSettingsArgs';

@Injectable()
export class ProjectConfigurationSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  create(
    resourceId: string,
    userId: string
  ): Promise<ProjectConfigurationSettings> {
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
          blockType: EnumBlockType.ProjectConfigurationSettings,
          displayName: 'Project Configuration Settings'
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
        where: { id: projectConfigurationSettings.id },
        ...projectConfigurationSettings,
        ...args
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
