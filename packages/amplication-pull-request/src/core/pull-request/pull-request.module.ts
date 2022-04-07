import { GitModule } from '@amplication/git-service';
import { Module } from '@nestjs/common';
import { DiffModule } from '../diff/diff.module';
import { PullRequestController } from './pull-request.controller';
import { PullRequestService } from './pull-request.service';

@Module({
  controllers: [PullRequestController],
  imports: [DiffModule, GitModule],
  providers: [PullRequestService],
})
export class PullRequestModule {}
