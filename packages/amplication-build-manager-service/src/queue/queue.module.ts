import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService, KAFKA_CLIENT } from './queue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            name: KAFKA_CLIENT,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>('KAFKA_CLIENT_ID'),
                brokers: configService.get<string[]>('KAFKA_BROKERS'),
              },
              consumer: {
                groupId: configService.get<string>('KAFKA_GROUP_ID'),
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
