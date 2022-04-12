import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue.module';
import { GitOrganizationModule } from './repositories/gitOrganization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    QueueModule,
    GitOrganizationModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
