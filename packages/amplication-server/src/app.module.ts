import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { CoreModule } from './core/core.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { WinstonConfigService } from './services/winstonConfig.service';
import { WinstonModule } from 'nest-winston';

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
        context: ({ req, prisma }) => ({ req, prisma: new PrismaClient() })
      }),
      inject: [ConfigService]
    }),
    CoreModule
  ],
  controllers: [],
  providers: [DateScalar]
})
export class AppModule {}
