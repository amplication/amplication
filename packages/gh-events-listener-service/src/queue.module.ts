import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService, QUEUE_SERVICE_NAME } from './queue.service';

export const BROKER_IP_ENV_KEY = 'BROKER_IP_ENV_KEY';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QUEUE_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          const envBrokerIp: string =
            configService.get<string>(BROKER_IP_ENV_KEY);
          if (!envBrokerIp) {
            throw new Error('Missing broker ip in env file');
          }
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'repositoryPush',
                brokers: [envBrokerIp],
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
