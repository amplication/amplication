import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { DeploymentService } from './deployment.service';
import { DeploymentResolver } from './deployment.resolver';
import { DeploymentController } from './deployment.controller';
import { BackgroundModule } from '../background/background.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [PrismaModule, PermissionsModule, ActionModule, BackgroundModule],
  providers: [DeploymentService, DeploymentResolver],
  exports: [DeploymentService, DeploymentResolver],
  controllers: [DeploymentController]
})
export class DeploymentModule {}
