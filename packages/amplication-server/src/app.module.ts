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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
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
