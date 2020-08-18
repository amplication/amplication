import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { PrismaModule } from 'src/services/prisma.module';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { EntityModule } from 'src/core/entity/entity.module';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { BuildService } from './build.service';
import { BuildConsumer } from './build.consumer';
import { BuildQueueModule } from './build-queue.module';
import { BuildResolver } from './build.resolver';

@Module({
  imports: [
    ExceptionFiltersModule,
    GqlAuthModule,
    EntityModule,
    PrismaModule,
    PermissionsModule,
    BuildQueueModule
  ],
  providers: [BuildService, BuildConsumer, BuildResolver],
  exports: [BuildService, BuildConsumer, BuildResolver]
})
export class BuildModule {}
