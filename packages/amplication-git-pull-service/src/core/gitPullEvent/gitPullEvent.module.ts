import { Module } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { GitPullEventController } from "./gitPullEvent.controller";
import { PrismaModule } from "nestjs-prisma";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { StorageService } from "../../providers/storage/storage.service";
import { GitHostProviderService } from "../../providers/gitProvider/gitHostProvider.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

export const BROKER_IP_ENV_KEY = 'BROKER_IP_ENV_KEY';
export const GIT_PULL_EVENT_SERVICE_NAME = 'GIT_PULL_EVENT_SERVICE';
export const CONSUMER_GROUP_ID = 'CONSUMER_GROUP_ENV_ID';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike()
          ),
        }),
      ],
    }),
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: GIT_PULL_EVENT_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          const envBrokerIp =
            configService.get<string>(BROKER_IP_ENV_KEY);
          const groupId = configService.get<string>(CONSUMER_GROUP_ID);

          if (!envBrokerIp) {
            throw new Error('Missing broker ip in env file');
          }

          if (!groupId) {
            throw new Error('Missing group id in env file');
          }

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'repository-pull',
                brokers: [envBrokerIp],
              },
              consumer: {
                groupId: groupId
              }
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GitPullEventController],
  providers: [
    GitPullEventService,
    GitPullEventRepository,
    StorageService,
    GitHostProviderService,
    GitHostProviderFactory,
    GitClientService,
  ],
  exports: [GitPullEventService, PrismaModule],
})
export class GitPullEventModule {}
