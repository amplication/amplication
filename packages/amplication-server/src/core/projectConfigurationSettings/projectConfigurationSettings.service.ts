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
    user: User
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
      user.id
    );
    return projectConfigurationSettings;
  }
}
