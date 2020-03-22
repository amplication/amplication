import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { ResovlerMapModule } from './resolvers/resolver-map.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { WinstonConfigService } from './services/winstonConfig.service';
import { TypeOrmConfigService } from './services/typeOrmConfig.service';
import { SequelizeConfigService } from './services/sequelizeConfig.service';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import  { SequelizeModule} from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    WinstonModule.forRootAsync({ //TODO: should we import this module twice or once (second import is in ExceptionFilterModule)
      useClass : WinstonConfigService
    }),

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
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
  ],
  controllers: [],
  providers: [
    DateScalar,
  ]
})
export class AppModule {}
