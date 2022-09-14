import { Module } from '@nestjs/common';
import { CommitController } from './commit.controller';

@Module({
  controllers: [CommitController],
})
export class CommitModule {}
