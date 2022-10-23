import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BuildRunnerModule } from './build-runner/build-runner.module';
import { BuildLoggerModule } from './build-logger/build-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    BuildRunnerModule,
    BuildLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
