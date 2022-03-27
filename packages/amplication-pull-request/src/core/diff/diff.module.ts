import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiffService } from './diff.service';

@Module({
  providers: [DiffService],
  exports: [DiffService],
})
export class DiffModule {}
