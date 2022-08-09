import { AmplicationLoggerModule } from '@amplication/nest-logger-module';
import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SERVICE_NAME } from './constants';
import { CoreModule } from './core';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.trace(`Application shut down (signal: ${signal})`);
  }
}
