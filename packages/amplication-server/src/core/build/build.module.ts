import { forwardRef, Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { PrismaModule } from 'nestjs-prisma';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { EntityModule } from 'src/core/entity/entity.module';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { UserModule } from 'src/core/user/user.module';
import { AppRoleModule } from 'src/core/appRole/appRole.module';
import { BuildService } from './build.service';
import { BuildResolver } from './build.resolver';
import { BuildController } from './build.controller';
import { BackgroundModule } from '../background/background.module';
import { RootStorageModule } from '../storage/root-storage.module';
import { ActionModule } from '../action/action.module';
import { ContainerBuilderRootModule } from '../containerBuilder/containerBuilderRoot.module';
import { StorageOptionsModule } from '../storage/storage-options.module';
// eslint-disable-next-line import/no-cycle
import { AppModule } from '../app/app.module';

@Module({
  imports: [
    ExceptionFiltersModule,
    GqlAuthModule,
    EntityModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    RootStorageModule,
    AppRoleModule,
    ActionModule,
    BackgroundModule,
    ContainerBuilderRootModule,
    StorageOptionsModule,
    forwardRef(() => AppModule)
  ],
  providers: [BuildService, BuildResolver],
  exports: [BuildService, BuildResolver],
  controllers: [BuildController]
})
export class BuildModule {}
