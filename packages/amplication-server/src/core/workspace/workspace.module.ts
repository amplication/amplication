import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceResolver } from './workspace.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from '../account/account.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppModule } from '../app/app.module';

@Module({
  imports: [PrismaModule, AccountModule, PermissionsModule, AppModule],
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService, WorkspaceResolver]
})
export class WorkspaceModule {}
