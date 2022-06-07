import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceResolver } from './workspace.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from '../account/account.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppModule } from '../app/app.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    PermissionsModule,
    AppModule,
    MailModule,
    UserModule,
    SubscriptionModule
  ],
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService, WorkspaceResolver]
})
export class WorkspaceModule {}
