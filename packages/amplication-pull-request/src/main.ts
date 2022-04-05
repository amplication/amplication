import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { config } from 'dotenv';

export const QUEUE_BROKER_URL_VAR = 'QUEUE_BROKER_URL_VAR';
const clientId = 'pull-request-queue-client';

async function bootstrap() {
  config();
  const envBrokerIp = process.env[QUEUE_BROKER_URL_VAR];
  if (!envBrokerIp) {
    throw new Error('Missing broker ip in env file');
  }
  const brokers = envBrokerIp.split(',');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers,
        },
        consumer: { groupId: 'pull-request' },
      },
    }
  );

  await app.listen();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
