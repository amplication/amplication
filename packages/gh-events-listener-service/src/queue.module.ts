import { Module } from '@nestjs/common';
import { QueueService, QUEUE_SERVICE_NAME } from './queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';

export const BROKER_IP_ENV_KEY = 'BROKER_IP_ENV_KEY';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.registerAsync([
      {
        name: QUEUE_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          const envBrokerIp = configService.get<string>(BROKER_IP_ENV_KEY);
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
})
export class QueueModule {}
