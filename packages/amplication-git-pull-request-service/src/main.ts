import { createNestjsKafkaConfig } from '@amplication/kafka';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    createNestjsKafkaConfig()
  );

  await app.listen();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
