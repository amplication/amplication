import { Module } from '@nestjs/common';
import { ProjectService } from './project';
import { PrismaService } from './../services/prisma.service';

@Module({
  imports: [
  ],
  providers: [
    PrismaService,
    ProjectService
  ],
  exports: [
  ]
})
export class CoreModule {}
