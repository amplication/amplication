import { CodeBuildService } from './codeBuild.service';
import { Module } from '@nestjs/common';
import { BuildContextStorageModule } from '../buildContextStorage/buildContextStorage.module';

@Module({
  imports: [BuildContextStorageModule],
  providers: [CodeBuildService],
  exports: [CodeBuildService],
})
export class CodeBuildModule {}
