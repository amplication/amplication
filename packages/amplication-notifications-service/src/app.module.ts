import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { SecretsManagerModule } from './providers/secrets/secretsManager.module';
import { MorganModule } from 'nest-morgan';
import { ConfigModule } from '@nestjs/config';
import { RootWinstonModule } from './services/root-winston.module';
import { NotificationsModule } from './core/notifications/notifications.module';

@Module({
  controllers: [],
  imports: [
    HealthModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    RootWinstonModule,
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}
