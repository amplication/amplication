import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { BlockModule } from '../block/block.module';
import { BuildModule } from '../build/build.module'; // eslint-disable-line import/no-cycle
import { EnvironmentModule } from '../environment/environment.module';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { CommitModule } from '../commit/commit.module'; // eslint-disable-line import/no-cycle
import { GitModule } from '@amplication/git-service';
import { AppSettingsModule } from '../appSettings/appSettings.module';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    AppSettingsModule,
    forwardRef(() => BuildModule),
    EnvironmentModule,
    CommitModule,
    BlockModule,
    GitModule
  ],
  providers: [AppService, AppResolver],
  exports: [AppService, AppResolver]
})
export class AppModule {}
