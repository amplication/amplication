import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { BuildModule } from '../build/build.module'; // eslint-disable-line import/no-cycle
import { EnvironmentModule } from '../environment/environment.module';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { CommitResolver } from '../commit/commit.resolver';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    forwardRef(() => BuildModule),
    EnvironmentModule
  ],
  providers: [AppService, AppResolver, CommitResolver],
  exports: [AppService, AppResolver, CommitResolver]
})
export class AppModule {}
