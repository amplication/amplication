import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { PaddleService } from './paddle.service';
import { SubscriptionService } from './subscription.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { PaddleController } from './paddle.controller';
import { SubscriptionResolver } from './subscription.resolver';
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule
  ],
  providers: [PaddleService, SubscriptionService, SubscriptionResolver],
  controllers: [PaddleController],
  exports: [PaddleService, SubscriptionService, SubscriptionResolver]
})
export class SubscriptionModule {}
