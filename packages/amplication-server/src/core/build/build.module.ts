import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { PrismaModule } from '@amplication/prisma-db';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { EntityModule } from 'src/core/entity/entity.module';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { UserModule } from 'src/core/user/user.module';
import { AppRoleModule } from 'src/core/appRole/appRole.module';
import { AppModule } from 'src/core/app/app.module'; // eslint-disable-line import/no-cycle
import { AppSettingsModule } from 'src/core/appSettings/appSettings.module'; // eslint-disable-line import/no-cycle
import { BuildService } from './build.service';
import { BuildResolver } from './build.resolver';
import { BuildController } from './build.controller';
import { RootStorageModule } from '../storage/root-storage.module';
import { ActionModule } from '../action/action.module';
import { StorageOptionsModule } from '../storage/storage-options.module';
import { BuildFilesSaver } from './utils';
import { QueueModule } from '../queue/queue.module';
import { CommitModule } from '../commit/commit.module'; // eslint-disable-line import/no-cycle

@Module({
  imports: [
    ConfigModule,
    ExceptionFiltersModule,
    GqlAuthModule,
    EntityModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    RootStorageModule,
    AppRoleModule,
    ActionModule,
    StorageOptionsModule,
    forwardRef(() => AppModule),
    AppSettingsModule,
    QueueModule,
    forwardRef(() => CommitModule)
  ],
  providers: [BuildService, BuildResolver, BuildFilesSaver],
  exports: [BuildService, BuildResolver],
  controllers: [BuildController]
})
export class BuildModule {}
