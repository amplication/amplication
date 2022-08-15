import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceResolver } from './workspace.resolver';
import { PrismaModule } from '@amplication/prisma-db';
import { AccountModule } from '../account/account.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppModule } from '../app/app.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { HubSpotAnalyticsModule } from 'src/services/hub-spot-analytics/hub-spot-analytics.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    PermissionsModule,
    AppModule,
    MailModule,
    UserModule,
    SubscriptionModule,
    HubSpotAnalyticsModule
  ],
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService, WorkspaceResolver]
})
export class WorkspaceModule {}
