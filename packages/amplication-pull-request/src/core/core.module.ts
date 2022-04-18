import { Module } from '@nestjs/common';
import { PullRequestModule } from './pull-request';
@Module({
  imports: [PullRequestModule],
  exports: [PullRequestModule],
})
export class CoreModule {}
