import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { GeneratedAppService } from './generatedApp.service';

@Module({
  imports: [ExceptionFiltersModule, GqlAuthModule],
  providers: [GeneratedAppService],
  exports: [GeneratedAppService]
})
export class GeneratedAppModule {}
