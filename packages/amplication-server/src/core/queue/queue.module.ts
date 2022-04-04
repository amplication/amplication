import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService, QUEUE_SERVICE_NAME } from './queue.service';

export const QUEUE_BROKER_URL_VAR = 'QUEUE_BROKER_URL_VAR';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QUEUE_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          const envBrokerIp = configService.get<string>(QUEUE_BROKER_URL_VAR);
          if (!envBrokerIp) {
            throw new Error('Missing broker ip in env file');
          }
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'server-queue-client',
                brokers: [envBrokerIp]
              }
            }
          };
        },
        inject: [ConfigService]
      }
    ])
  ],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
