import { PrismaModule } from '@amplication/prisma-db';
import { Module } from '@nestjs/common';
import { BlockModule } from '../block/block.module';
import { BuildModule } from '../build/build.module';
import { EntityModule } from '../entity/entity.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ResourceModule } from '../resource/resource.module';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    ResourceModule,
    BlockModule,
    EntityModule,
    BuildModule
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectResolver, ProjectService]
})
export class ProjectModule {}
