import { Module, OnApplicationShutdown } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MorganModule } from 'nest-morgan';
import { Request } from 'express';
import { CoreModule } from './core/core.module';
import { InjectContextInterceptor } from './interceptors/inject-context.interceptor';
import { RootWinstonModule } from './services/root-winston.module';
import { RootStorageModule } from './core/storage/root-storage.module';
import { SegmentAnalyticsModule } from './services/segmentAnalytics/segmentAnalytics.module';
import { SegmentAnalyticsOptionsService } from './services/segmentAnalytics/segmentAnalyticsOptionsService';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { SendgridConfigService } from './services/sendgridConfig.service';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule, GoogleSecretsManagerModule],
      inject: [ConfigService, GoogleSecretsManagerService],
      useClass: SendgridConfigService
    }),

    RootWinstonModule,

    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1',
        playground: configService.get('PLAYGROUND_ENABLE') === '1',
        context: ({ req }: { req: Request }) => ({
          req
        })
      }),
      inject: [ConfigService]
    }),

    RootStorageModule,

    MorganModule,
    SegmentAnalyticsModule.registerAsync({
      useClass: SegmentAnalyticsOptionsService
    }),
    CoreModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectContextInterceptor
    }
  ]
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string): void {
    console.trace(`Application shut down (signal: ${signal})`);
  }
}
