import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { BuildModule } from '../build/build.module';

@Module({
  imports: [BuildModule],
  controllers: [SystemController]
})
export class SystemModule {}
