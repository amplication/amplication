import { PrismaModule } from '@amplication/prisma-db';
import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectResolver, ProjectService]
})
export class ProjectModule {}
