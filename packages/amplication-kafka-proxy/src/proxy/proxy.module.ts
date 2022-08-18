import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProxyService } from './proxy.service';
import { ConfigService } from '@nestjs/config';
import { generateKafkaConfig } from 'src/utils/generate-kafka-config';
import { AmplicationLoggerModule } from '@amplication/nest-logger-module';
import { SERVICE_NAME } from 'src/utils/constants';

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
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
  ],
  providers: [ProxyService, ConfigService],
})
export class ProxyModule {}
