import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { BlockModule } from '../block/block.module';
import { BuildModule } from '../build/build.module'; // eslint-disable-line import/no-cycle
import { EnvironmentModule } from '../environment/environment.module';
import { ResourceService } from './resource.service';
import { ResourceResolver } from './resource.resolver';
import { CommitModule } from '../commit/commit.module'; // eslint-disable-line import/no-cycle
import { GitModule } from '@amplication/git-service';
import { ServiceSettingsModule } from '../serviceSettings/serviceSettings.module';
import { ProjectConfigurationSettingsModule } from '../projectConfigurationSettings/projectConfigurationSettings.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    ServiceSettingsModule,
    forwardRef(() => BuildModule),
    EnvironmentModule,
    CommitModule,
    BlockModule,
    GitModule,
    ProjectConfigurationSettingsModule,
    forwardRef(() => ProjectModule)
  ],
  providers: [ResourceService, ResourceResolver],
  exports: [ResourceService, ResourceResolver]
})
export class ResourceModule {}
