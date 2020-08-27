import { Module } from '@nestjs/common';
import { RootWinstonModule } from 'src/services/root-winston.module';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';

@Module({
  imports: [RootWinstonModule],
  providers: [GqlResolverExceptionsFilter],
  exports: [GqlResolverExceptionsFilter]
})
export class ExceptionFiltersModule {}
