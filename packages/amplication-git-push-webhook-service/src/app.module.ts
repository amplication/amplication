import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { QueueModule } from './queue.module';
import { GitOrganizationModule } from './repositories/gitOrganization.module';
import { RootWinstonModule } from './services/root-winston.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    QueueModule,
    GitOrganizationModule,
    RootWinstonModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
