import { CodeBuildService } from './codeBuild.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CodeBuildService],
  exports: [CodeBuildService],
})
export class CodeBuildModule {}
