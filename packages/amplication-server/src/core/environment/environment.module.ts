import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [EnvironmentService],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
