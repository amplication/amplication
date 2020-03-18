import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './allExceptions.filter';
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
    AllExceptionsFilter
  ],
  exports:[
    AllExceptionsFilter,
    ContextLoggerModule
  ]
})
export class ExceptionFiltersModule {}
