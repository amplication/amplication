import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EntityService } from '../entity/entity.service';
import { AppResolver } from './AppResolver';
import { PrismaModule } from '../../services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [AppService, AppResolver, EntityService],
  exports: [AppService, AppResolver]
})
export class AppModule {}
