import { Module, Global } from '@nestjs/common';
import { ContextLoggerService } from './contextLogger.service';

//@Global()
@Module({
  providers: [ContextLoggerService],
  exports: [ContextLoggerService]
})
export class ContextLoggerModule {}
