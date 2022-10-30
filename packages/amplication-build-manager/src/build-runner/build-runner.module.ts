import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';
import { BuildRunnerController } from './build-runner.controller';
import { BuildRunnerService } from './build-runner.service';

@Module({
  imports: [QueueModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService],
})
export class BuildRunnerModule {}
