import { EnvironmentVariables } from '@amplication/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

export const KAFKA_BROKER_URL_VAR = 'KAFKA_BROKER_URL_VAR';
const clientId = 'pull-request-queue-client';

async function bootstrap() {
  const brokers = EnvironmentVariables.getArray(
    KAFKA_BROKER_URL_VAR,
    true,
    ','
  );

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
