import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { ConfigModule } from '@nestjs/config';
import { PaddleService } from './paddle.service';
import { SubscriptionService } from './subscription.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { PaddleController } from './paddle.controller';
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule
  ],
  providers: [PaddleService, SubscriptionService],
  controllers: [PaddleController],
  exports: [PaddleService, SubscriptionService]
})
export class SubscriptionModule {}
