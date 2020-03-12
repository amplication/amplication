import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import {ResovlerMapModule} from './resolvers/resolver-map.module'

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient} from '@prisma/client'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    ResovlerMapModule
  ],
  controllers: [],
  providers: [DateScalar]
})
export class AppModule {}
