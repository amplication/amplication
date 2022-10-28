import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import { GitOrganizationModule } from './git-organization/git-organization.module';
import { HealthModule } from './health/health.module';
import { AmplicationLoggerModule } from '@amplication/nest-logger-module';

@Module({
  imports: [
    AmplicationLoggerModule.register({
      metadata: { service: 'amplication-git-pull-service' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    QueueModule,
    GitOrganizationModule,
    HealthModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
