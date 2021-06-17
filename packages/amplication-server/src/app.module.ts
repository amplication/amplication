import * as path from 'path';
import { Module, OnApplicationShutdown } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MorganModule } from 'nest-morgan';
import { Request } from 'express';
import { CoreModule } from './core/core.module';
import { InjectContextInterceptor } from './interceptors/inject-context.interceptor';
import { RootWinstonModule } from './services/root-winston.module';
import { RootStorageModule } from './core/storage/root-storage.module';
import { SegmentAnalyticsModule } from './services/segmentAnalytics/segmentAnalytics.module';
import { SegmentAnalyticsOptionsService } from './services/segmentAnalytics/segmentAnalyticsOptionsService';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

const SEND_GRID_API_KEY_VAR = 'SENDGRID_API_KEY';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        apiKey: cfg.get(SEND_GRID_API_KEY_VAR)
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(
        __dirname,
        '..',
        '..',
        '..',
        'amplication-client',
        'build'
      )
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
  onApplicationShutdown(signal: string) {
    console.trace(`Application shut down (signal: ${signal})`);
  }
}
