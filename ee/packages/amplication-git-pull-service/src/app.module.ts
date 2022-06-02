import { Module } from '@nestjs/common';
import { GitPullEventModule } from './core/gitPullEvent/gitPullEvent.module';
import { HealthModule } from './health/health.module';
import { SecretsManagerModule } from './providers/secrets/secretsManager.module';
import { MorganModule } from 'nest-morgan';
import { ConfigModule } from '@nestjs/config';
import { RootWinstonModule } from './services/root-winston.module';

@Module({
  controllers: [],
  imports: [
    GitPullEventModule,
    HealthModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    RootWinstonModule,
  ],
  providers: [],
})
export class AppModule {}
