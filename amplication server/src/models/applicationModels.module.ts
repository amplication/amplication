import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountDB } from './Account';

@Module({
  imports: [SequelizeModule.forFeature([AccountDB])],
  exports: [SequelizeModule]
})
export class ApplicationModelsModule {}