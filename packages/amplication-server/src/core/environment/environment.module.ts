import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { EnvironmentService } from './environment.service';
import { EnvironmentResolver } from './environment.resolver';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [EnvironmentService, EnvironmentResolver],
  exports: [EnvironmentService, EnvironmentResolver]
})
export class EnvironmentModule {}
