import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProxyService } from './proxy.service';
import { ConfigService } from '@nestjs/config';
import { generateKafkaConfig } from 'src/utils/generate-kafka-config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        useFactory: () => {
          return {
            ...generateKafkaConfig(),
          };
        },
      },
    ]),
  ],
  providers: [ProxyService, ConfigService],
})
export class ProxyModule {}
