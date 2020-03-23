import { Module } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';
import { ContextLoggerModule} from '../services/contextLogger.module';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from '../services/winstonConfig.service'


@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass : WinstonConfigService
    }),
    ContextLoggerModule,
  ],
  providers: [
    GqlResolverExceptionsFilter
  ],
  exports:[
    GqlResolverExceptionsFilter,
    ContextLoggerModule
  ]
})
export class ExceptionFiltersModule {}
