import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExceptionFiltersModule } from '../../filters/exceptionFilters.module';
import { PrismaModule } from '@amplication/prisma-db';
import { GqlAuthModule } from '../../guards/gql-auth.module';
import { EntityModule } from '../entity/entity.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { ResourceRoleModule } from '../resourceRole/resourceRole.module';
import { ResourceModule } from '../resource/resource.module'; // eslint-disable-line import/no-cycle
import { ServiceSettingsModule } from '../serviceSettings/serviceSettings.module'; // eslint-disable-line import/no-cycle
import { BuildService } from './build.service';
import { BuildResolver } from './build.resolver';
import { BuildController } from './build.controller';
import { RootStorageModule } from '../storage/root-storage.module';
import { ActionModule } from '../action/action.module';
import { StorageOptionsModule } from '../storage/storage-options.module';
import { BuildFilesSaver } from './utils';
import { QueueModule } from '../queue/queue.module';
import { CommitModule } from '../commit/commit.module';
import {JsonClassSerializer, KafkaProducerModule, StringSerializerService} from "@amplication/kafka"; // eslint-disable-line import/no-cycle

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
    ResourceRoleModule,
    ActionModule,
    StorageOptionsModule,
    forwardRef(() => ResourceModule),
    ServiceSettingsModule,
    QueueModule,
    forwardRef(() => CommitModule),
    KafkaProducerModule.register(StringSerializerService,JsonClassSerializer)
  ],
  providers: [BuildService, BuildResolver, BuildFilesSaver],
  exports: [BuildService, BuildResolver],
  controllers: [BuildController]
})
export class BuildModule {}
