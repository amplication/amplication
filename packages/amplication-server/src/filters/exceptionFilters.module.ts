import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RootWinstonModule } from 'src/services/root-winston.module';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';

@Module({
  imports: [ConfigModule, RootWinstonModule],
  providers: [GqlResolverExceptionsFilter],
  exports: [GqlResolverExceptionsFilter]
})
export class ExceptionFiltersModule {}
