import { CodeBuildService } from './codeBuild.service';
import { Module } from '@nestjs/common';
import { BuildStorageModule } from '../buildStorage/buildStorage.module';
import { QueueModule } from '../queue/queue.module';

export const CODE_BUILD_SERVICE = 'CODE_BUILD_SERVICE';

@Module({
  imports: [BuildStorageModule, QueueModule],
  providers: [
    {
      provide: CODE_BUILD_SERVICE,
      useClass: CodeBuildService,
    },
  ],
  exports: [
    {
      provide: CODE_BUILD_SERVICE,
      useClass: CodeBuildService,
    },
  ],
})
export class CodeBuildModule {}
