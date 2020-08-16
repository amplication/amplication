import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { WinstonModule } from 'nest-winston';
import { Request } from 'express';
import { StorageModule, DriverType } from 'src/vendor/nestjs-storage';
import { QUEUE_NAME as BUILD_QUEUE_NAME } from './core/build/constants';
import { DateScalar } from './common/scalars/date.scalar';
import { CoreModule } from './core/core.module';
import { WinstonConfigService } from './services/winstonConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    WinstonModule.forRootAsync({
      //TODO: should we import this module twice or once (second import is in ExceptionFilterModule)
      useClass: WinstonConfigService
    }),

    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1' ? true : false,
        playground:
          configService.get('PLAYGROUND_ENABLE') === '1' ? true : false,
        context: ({ req }: { req: Request }) => ({
          req,
          prisma: new PrismaClient()
        })
      }),
      inject: [ConfigService]
    }),

    BullModule.registerQueue({
      name: BUILD_QUEUE_NAME
    }),

    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd()
          }
        }
      }
    }),

    CoreModule
  ],
  controllers: [],
  providers: [DateScalar]
})
export class AppModule {}
