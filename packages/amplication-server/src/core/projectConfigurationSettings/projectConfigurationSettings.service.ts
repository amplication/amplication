import { EnumBlockType } from '@amplication/prisma-db';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models';
import { BlockService } from '../block/block.service';
import { ProjectConfigurationSettings } from './dto/ProjectConfigurationSettings';

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
}
