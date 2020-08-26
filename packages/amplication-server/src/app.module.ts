import * as path from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaClient } from '@prisma/client';
import { WinstonModule } from 'nest-winston';
import { Request } from 'express';
import { StorageModule } from '@codebrew/nestjs-storage';
import { DateScalar } from './common/scalars/date.scalar';
import { CoreModule } from './core/core.module';
import { WinstonConfigService } from './services/winstonConfig.service';
import { BuildQueueModule } from './core/build/build-queue.module';
import { storageOptions } from './core/storage/storage.options';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectContextInterceptor } from './interceptors/inject-context.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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

    WinstonModule.forRootAsync({
      //TODO: should we import this module twice or once (second import is in ExceptionFilterModule)
      useClass: WinstonConfigService
    }),

    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1',
        playground: configService.get('PLAYGROUND_ENABLE') === '1',
        context: ({ req }: { req: Request }) => ({
          req,
          prisma: new PrismaClient()
        })
      }),
      inject: [ConfigService]
    }),

    BuildQueueModule,

    StorageModule.forRoot(storageOptions),

    CoreModule
  ],
  controllers: [],
  providers: [
    DateScalar,
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectContextInterceptor
    }
  ]
})
export class AppModule {}
