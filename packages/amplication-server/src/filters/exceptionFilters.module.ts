import { Module } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';
import { ContextLoggerModule } from '../services/contextLogger.module';

@Module({
  imports: [ContextLoggerModule],
  providers: [GqlResolverExceptionsFilter],
  exports: [GqlResolverExceptionsFilter, ContextLoggerModule]
})
export class ExceptionFiltersModule {}
