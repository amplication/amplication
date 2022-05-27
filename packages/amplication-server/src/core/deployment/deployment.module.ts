import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { DockerModule } from '../docker/docker.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ActionModule } from '../action/action.module';
import { DeployerRootModule } from '../deployer/deployerRoot.module';
import { DeploymentService } from './deployment.service';
import { DeploymentResolver } from './deployment.resolver';
import { UserModule } from '../user/user.module';
import { EnvironmentModule } from '../environment/environment.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    DockerModule,
    DeployerRootModule,
    PermissionsModule,
    ActionModule,
    UserModule,
    EnvironmentModule,
    MailModule
  ],
  providers: [DeploymentService, DeploymentResolver],
  exports: [DeploymentService, DeploymentResolver]
})
export class DeploymentModule {}
