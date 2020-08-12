import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { EntityModule } from 'src/core/entity/entity.module';
import { BuildService } from './build.service';

@Module({
  imports: [ExceptionFiltersModule, GqlAuthModule, EntityModule],
  providers: [BuildService],
  exports: [BuildService]
})
export class BuildModule {}
