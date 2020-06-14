import { Module } from '@nestjs/common';
import { ContextLoggerService } from './contextLogger.service';

@Module({
  providers: [ContextLoggerService],
  exports: [ContextLoggerService]
})
export class ContextLoggerModule {}
