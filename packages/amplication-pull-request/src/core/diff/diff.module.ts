import { Module } from '@nestjs/common';
import { DiffService } from './diff.service';
import { BuildsPathFactory } from './utils/BuildsPathFactory';

@Module({
  providers: [DiffService, BuildsPathFactory],
  exports: [DiffService],
})
export class DiffModule {}
