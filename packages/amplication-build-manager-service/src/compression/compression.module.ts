import { Module } from '@nestjs/common';
import { CompressionService } from './compression.service';

@Module({
  providers: [CompressionService],
  exports: [CompressionService],
})
export class CompressionModule {}
