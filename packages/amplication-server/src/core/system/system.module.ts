import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { BuildModule } from '../build/build.module';
import { DeploymentModule } from '../deployment/deployment.module';

@Module({
  imports: [BuildModule, DeploymentModule],
  controllers: [SystemController]
})
export class SystemModule {}
