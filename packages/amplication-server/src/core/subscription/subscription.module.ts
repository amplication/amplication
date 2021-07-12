import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { PaddleService } from './paddle.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule
  ],
  providers: [PaddleService],
  exports: [PaddleService]
})
export class SubscriptionModule {}
