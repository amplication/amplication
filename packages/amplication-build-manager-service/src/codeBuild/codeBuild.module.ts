import { CodeBuildService } from './codeBuild.service';
import { Module } from '@nestjs/common';
import { BuildContextStorageService } from 'src/buildContextStorage/buildContextStorage.service';

@Module({
  imports: [BuildContextStorageService],
  providers: [CodeBuildService],
  exports: [CodeBuildService],
})
export class CodeBuildModule {}
