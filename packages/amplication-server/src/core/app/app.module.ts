import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { BlockModule } from '../block/block.module';
import { BuildModule } from '../build/build.module'; // eslint-disable-line import/no-cycle
import { EnvironmentModule } from '../environment/environment.module';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { CommitModule } from '../commit/commit.module'; // eslint-disable-line import/no-cycle
import { GithubModule } from '../github/github.module'; // eslint-disable-line import/no-cycle

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    forwardRef(() => BuildModule),
    EnvironmentModule,
    CommitModule,
    GithubModule,
    BlockModule
  ],
  providers: [AppService, AppResolver],
  exports: [AppService, AppResolver]
})
export class AppModule {}
