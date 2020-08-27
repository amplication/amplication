import { Module } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';

@Module({
  providers: [GqlResolverExceptionsFilter],
  exports: [GqlResolverExceptionsFilter]
})
export class ExceptionFiltersModule {}
