import { Module } from '@nestjs/common';
import { DiffModule } from '../diff/diff.module';
import { PullRequestService } from './pull-request.service';
@Module({
  imports: [DiffModule],
  providers: [PullRequestService],
})
export class PullRequestModule {}
