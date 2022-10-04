import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { BlockModule } from '../block/block.module';
import { BuildModule } from '../build/build.module';
import { EnvironmentModule } from '../environment/environment.module';
import { ResourceService } from './resource.service';
import { ResourceResolver } from './resource.resolver';
import { CommitModule } from '../commit/commit.module';
import { GitModule } from '@amplication/git-utils';
import { ServiceSettingsModule } from '../serviceSettings/serviceSettings.module';
import { ProjectConfigurationSettingsModule } from '../projectConfigurationSettings/projectConfigurationSettings.module';
import { ProjectModule } from '../project/project.module';
import { ServiceTopicsModule } from '../serviceTopics/serviceTopics.module';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    ServiceSettingsModule,
    ServiceTopicsModule,
    forwardRef(() => BuildModule),
    EnvironmentModule,
    CommitModule,
    BlockModule,
    GitModule,
    ProjectConfigurationSettingsModule,
    forwardRef(() => ProjectModule),
  ],
  providers: [ResourceService, ResourceResolver],
  exports: [ResourceService, ResourceResolver],
})
export class ResourceModule {}
