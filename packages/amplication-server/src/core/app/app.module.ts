import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EntityService } from '../entity/entity.service';
import { AppResolver } from './app.resolver';
import { CommitResolver } from './commit.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, PermissionsModule, UserModule],
  providers: [AppService, AppResolver, EntityService, CommitResolver],
  exports: [AppService, AppResolver, CommitResolver]
})
export class AppModule {}
