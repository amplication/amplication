import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue.module';

export const BROKER_IP_ENV_KEY = 'BROKER_IP_ENV_KEY';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    QueueModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
