import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { EnvironmentModule } from '../environment/environment.module';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { CommitResolver } from './commit.resolver';
// eslint-disable-next-line import/no-cycle
import { BuildModule } from '../build/build.module';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    EnvironmentModule,
    forwardRef(() => BuildModule)
  ],
  providers: [AppService, AppResolver, CommitResolver],
  exports: [AppService, AppResolver, CommitResolver]
})
export class AppModule {}
