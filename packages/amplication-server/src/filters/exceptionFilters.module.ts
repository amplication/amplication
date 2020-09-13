import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RootWinstonModule } from 'src/services/root-winston.module';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';

@Module({
  imports: [RootWinstonModule],
  providers: [GqlResolverExceptionsFilter, ConfigService],
  exports: [GqlResolverExceptionsFilter]
})
export class ExceptionFiltersModule {}
