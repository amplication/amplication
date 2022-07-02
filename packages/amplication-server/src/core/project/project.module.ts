import { PrismaModule } from '@amplication/prisma-db';
import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectResolver, ProjectService]
})
export class ProjectModule {}
