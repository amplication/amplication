import { CodeBuildService } from './codeBuild.service';
import { Module } from '@nestjs/common';
import { BuildContextStorageModule } from '../buildContextStorage/buildContextStorage.module';

export const CODE_BUILD_SERVICE = 'CODE_BUILD_SERVICE';

@Module({
  imports: [BuildContextStorageModule],
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
