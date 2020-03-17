import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { ResovlerMapModule } from './resolvers/resolver-map.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { WinstonConfigService } from './services/winstonConfig.service'
import { WinstonModule } from 'nest-winston';
import { ContextLoggerModule} from './services/contextLogger.module';

import * as winston from 'winston';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    WinstonModule.forRootAsync({
      useClass : WinstonConfigService
    }),

    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1' ? true : false,
        playground:
          configService.get('PLAYGROUND_ENABLE') === '1' ? true : false,
        context: ({ req, prisma }) => ({ req, prisma: new PrismaClient() })
      }),
      inject: [ConfigService]
    }),
    ResovlerMapModule,
    ContextLoggerModule
  ],
  controllers: [],
  providers: [DateScalar]
})
export class AppModule {}
